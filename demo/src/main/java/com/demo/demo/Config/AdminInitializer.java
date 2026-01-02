package com.demo.demo.Config;

import com.demo.demo.Entity.Role;
import com.demo.demo.Entity.User;
import com.demo.demo.Repository.RoleRepository;
import com.demo.demo.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {

            Role adminRole = roleRepository.findById("ADMIN").orElseGet(() -> {
                Role newRole = Role.builder()
                        .name("ADMIN")
                        .description("System Administrator")
                        .build();
                return roleRepository.save(newRole);
            });

            Role userRole = roleRepository.findById("USER").orElseGet(() -> {
                Role newRole = Role.builder()
                        .name("USER")
                        .description("Standard User")
                        .build();
                return roleRepository.save(newRole);
            });

            // 4. Tạo tài khoản Admin
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin")) // Mã hóa pass "admin"
                    .fullName("Administrator")
                    .email("admin@gmail.com")
                    .roles(new HashSet<>(Set.of(adminRole, userRole)))
                    .build();

            userRepository.save(admin);
            log.info("Admin Creation Complete");
        } else {
            log.info("Admin exists");
        }
    }
}
