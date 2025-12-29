package com.haunguyen.hello_spring_boot.mapper;

import com.haunguyen.hello_spring_boot.dto.request.PermissionRequest;
import com.haunguyen.hello_spring_boot.dto.request.UserCreationRequest;
import com.haunguyen.hello_spring_boot.dto.response.PermissionResponse;
import com.haunguyen.hello_spring_boot.dto.response.UserResponse;
import com.haunguyen.hello_spring_boot.entity.Permission;
import com.haunguyen.hello_spring_boot.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission
            (PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
