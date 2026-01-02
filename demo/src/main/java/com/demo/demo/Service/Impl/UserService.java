package com.demo.demo.Service.Impl;

import com.demo.demo.Dto.Request.UserCreationRequest;
import com.demo.demo.Dto.Request.UserUpdateRequest;
import com.demo.demo.Dto.Response.UserResponse;
import com.demo.demo.Entity.Role;
import com.demo.demo.Entity.User;
import com.demo.demo.Mapper.UserMapper;
import com.demo.demo.Repository.RoleRepository;
import com.demo.demo.Repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;



    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findById("USER")
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền USER trong Database."));
            roles.add(userRole);
        } else {
            strRoles.forEach(roleName -> {
                Role role = roleRepository.findById(roleName)
                        .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền " + roleName));
                roles.add(role);
            });
        }

        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);

        if(request.getPassword() != null)
            user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String id){
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public UserResponse getUserById(String username){
        var user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user này!"));
        return userMapper.toUserResponse(user);

    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toUserResponse(user);

    }

    public List<UserResponse> getAll(){

        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
}
