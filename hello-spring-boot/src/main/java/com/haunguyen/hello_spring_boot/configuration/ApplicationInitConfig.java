package com.haunguyen.hello_spring_boot.configuration;

import com.haunguyen.hello_spring_boot.entity.User;
import com.haunguyen.hello_spring_boot.entity.Role;

import com.haunguyen.hello_spring_boot.repository.RoleRepository;
import com.haunguyen.hello_spring_boot.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){
        return args -> {
            if(userRepository.findByUsername("admin2").isEmpty()){

                String roleName = com.haunguyen.hello_spring_boot.enums.Role.ADMIN.name();

                Role adminRole = roleRepository.findById(roleName)
                        .orElseGet(() -> {
                            Role newRole = Role.builder()
                                    .name(roleName)
                                    .description("Administrator role")
                                    .build();
                            return roleRepository.save(newRole);
                        });

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username("admin2")
                        .password(passwordEncoder.encode("admin2"))
                        .roles(roles)
                        .build();
                userRepository.save(user);
                log.warn("admin user has beern created with default password");
            }
        };
    }
}
