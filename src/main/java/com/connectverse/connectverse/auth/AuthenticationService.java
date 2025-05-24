package com.connectverse.connectverse.auth;

import com.connectverse.connectverse.Dto.EmailVerificationRequest;
import com.connectverse.connectverse.Dto.ForgotPasswordRequest;
import com.connectverse.connectverse.Dto.ResetPasswordRequest;
import com.connectverse.connectverse.Dto.UserDto;
import com.connectverse.connectverse.Repository.UserRepository;
import com.connectverse.connectverse.config.JwtService;
import com.connectverse.connectverse.exception.EmailAlreadyExistsException;
import com.connectverse.connectverse.model.Role;
import com.connectverse.connectverse.model.User;
import com.connectverse.connectverse.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository repository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmailService emailService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    private UserDto convertToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .username(user.getUsername())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .build();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // Check if email already exists
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists in the database");
        }

        // Generate verification code
        String verificationCode = UUID.randomUUID().toString().substring(0, 6);

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .verificationCode(verificationCode)
                .emailVerified(false)
                .build();
        repository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email");
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(convertToUserDto(user))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(convertToUserDto(user))
                .build();
    }

    public UserDto getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserDto(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate a unique token
        String resetToken = UUID.randomUUID().toString();
        
        // Store the token in the user entity
        user.setResetToken(resetToken);
        repository.save(user);
        
        // Create reset link
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        var user = repository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null); // Clear the reset token
        repository.save(user);
    }

    public void sendVerificationCode(String email) {
        var user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new verification code
        String verificationCode = UUID.randomUUID().toString().substring(0, 6);
        user.setVerificationCode(verificationCode);
        repository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email");
        }
    }

    public void verifyEmail(EmailVerificationRequest request) {
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null); // Clear the verification code after successful verification
        repository.save(user);
    }
}
