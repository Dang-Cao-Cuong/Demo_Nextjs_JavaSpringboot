package com.demo.demo.Mapper;

import com.demo.demo.Dto.Request.RoleRequest;
import com.demo.demo.Dto.Response.RoleResponse;
import com.demo.demo.Entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
