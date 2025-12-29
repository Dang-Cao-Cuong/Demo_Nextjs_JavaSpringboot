package com.haunguyen.hello_spring_boot.mapper;

import com.haunguyen.hello_spring_boot.dto.request.UserCreationRequest;
import com.haunguyen.hello_spring_boot.dto.request.UserUpdateRequest;
import com.haunguyen.hello_spring_boot.dto.response.UserResponse;
import com.haunguyen.hello_spring_boot.entity.Role;
import com.haunguyen.hello_spring_boot.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "groups", ignore = true)
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

}
