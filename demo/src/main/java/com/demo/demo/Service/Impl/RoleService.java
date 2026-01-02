package com.demo.demo.Service.Impl;

import com.demo.demo.Dto.Request.RoleRequest;
import com.demo.demo.Dto.Response.RoleResponse;
import com.demo.demo.Entity.Role;
import com.demo.demo.Mapper.RoleMapper;
import com.demo.demo.Repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {

    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request) {
        String roleName = request.getName().toUpperCase();

        if (roleRepository.existsById(roleName)) {
            throw new RuntimeException("Role already exists: " + roleName);
        }

        Role role = roleMapper.toRole(request);
        role.setName(roleName);

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAll() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public void delete(String name) {
        if (!roleRepository.existsById(name)) {
            throw new RuntimeException("Role not found");
        }
        roleRepository.deleteById(name);
    }


}
