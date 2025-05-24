package com.connectverse.connectverse.Dto;

import com.connectverse.connectverse.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Integer id;
    private String email;
    private String firstname;
    private String lastname;
    private String username;
    private Role role;
    private boolean emailVerified;
} 