package com.demo.demo.Mapper;

import com.demo.demo.Dto.Request.UserCreationRequest;
import com.demo.demo.Dto.Request.UserUpdateRequest;
import com.demo.demo.Dto.Response.UserResponse;
import com.demo.demo.Entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User toUser(UserCreationRequest request);


    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
