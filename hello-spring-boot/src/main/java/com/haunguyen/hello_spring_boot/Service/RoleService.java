package com.haunguyen.hello_spring_boot.Service;

import com.haunguyen.hello_spring_boot.dto.request.RoleRequest;
import com.haunguyen.hello_spring_boot.dto.response.RoleResponse;
import com.haunguyen.hello_spring_boot.mapper.RoleMapper;
import com.haunguyen.hello_spring_boot.repository.PermissionRepository;
import com.haunguyen.hello_spring_boot.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request){
        var role = roleMapper.toRole(request);

        var permission = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permission));

        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll(){
        var roles = roleRepository.findAll();

        return roles.stream().map(role -> roleMapper.toRoleResponse(role)).toList();
    }

    public void delete(String role){
        roleRepository.deleteById(role);
    }
}
