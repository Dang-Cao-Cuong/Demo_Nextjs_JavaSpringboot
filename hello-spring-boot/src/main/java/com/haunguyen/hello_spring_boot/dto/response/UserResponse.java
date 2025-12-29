package com.haunguyen.hello_spring_boot.dto.response;

import com.haunguyen.hello_spring_boot.entity.Group;
import com.haunguyen.hello_spring_boot.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
     String id;
     String username;
     String lastName;
     LocalDate dob;
     Set<RoleResponse> roles;
     Set<GroupResponse> groups;
}
