package com.connectverse.connectverse.Repository;

import com.connectverse.connectverse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    List<User> findAll();
    List<User> findByUsernameContainingIgnoreCase(String username);
}
