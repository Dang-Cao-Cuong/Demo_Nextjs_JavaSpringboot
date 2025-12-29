package com.haunguyen.hello_spring_boot.mapper;

import com.haunguyen.hello_spring_boot.dto.request.RoleRequest;
import com.haunguyen.hello_spring_boot.dto.response.RoleResponse;
import com.haunguyen.hello_spring_boot.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);
}
