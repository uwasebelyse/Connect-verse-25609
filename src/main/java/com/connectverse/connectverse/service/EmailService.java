package com.connectverse.connectverse.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("noreply@connectverse.com");
        helper.setTo(to);
        helper.setSubject("Password Reset Request");
        
        String emailContent = String.format(
            "Hello,\n\n" +
            "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
            "%s\n\n" +
            "If you did not request this, please ignore this email.\n\n" +
            "Best regards,\n" +
            "ConnectVerse Team", resetLink
        );

        helper.setText(emailContent);
        mailSender.send(message);
    }

    public void sendVerificationEmail(String to, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("noreply@connectverse.com");
        helper.setTo(to);
        helper.setSubject("Email Verification");
        
        String emailContent = String.format(
            "Hello,\n\n" +
            "Thank you for registering with ConnectVerse. Please use the following verification code to verify your email:\n\n" +
            "%s\n\n" +
            "If you did not create this account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "ConnectVerse Team", verificationCode
        );

        helper.setText(emailContent);
        mailSender.send(message);
    }
} 