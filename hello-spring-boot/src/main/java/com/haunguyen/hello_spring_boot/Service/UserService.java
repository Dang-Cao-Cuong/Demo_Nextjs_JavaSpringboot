package com.haunguyen.hello_spring_boot.Service;

import com.haunguyen.hello_spring_boot.dto.request.UserCreationRequest;
import com.haunguyen.hello_spring_boot.dto.request.UserUpdateRequest;
import com.haunguyen.hello_spring_boot.dto.response.UserResponse;
import com.haunguyen.hello_spring_boot.entity.Group;
import com.haunguyen.hello_spring_boot.entity.Role;
import com.haunguyen.hello_spring_boot.entity.User;
import com.haunguyen.hello_spring_boot.exception.AppException;
import com.haunguyen.hello_spring_boot.exception.ErrorCode;
import com.haunguyen.hello_spring_boot.mapper.UserMapper;
import com.haunguyen.hello_spring_boot.repository.GroupRepository;
import com.haunguyen.hello_spring_boot.repository.RoleRepository;
import com.haunguyen.hello_spring_boot.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
     UserRepository userRepository;
     UserMapper userMapper;
     PasswordEncoder passwordEncoder;
     GroupRepository groupRepository;
     RoleRepository roleRepository;

    public UserResponse createUser(UserCreationRequest request){

        if(userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));




        var groups = groupRepository.findAllById(request.getGroups());
        user.setGroups(new HashSet<>(groups));


        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers(){
        log.info("In method get Users");
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXITED));


        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXITED));

        return userMapper.toUserResponse(user);

    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXITED)));
    }
}
