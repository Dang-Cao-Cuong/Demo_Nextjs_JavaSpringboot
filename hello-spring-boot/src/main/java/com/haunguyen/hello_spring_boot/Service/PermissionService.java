package com.haunguyen.hello_spring_boot.Service;

import com.haunguyen.hello_spring_boot.dto.request.PermissionRequest;
import com.haunguyen.hello_spring_boot.dto.response.PermissionResponse;
import com.haunguyen.hello_spring_boot.entity.Permission;
import com.haunguyen.hello_spring_boot.mapper.PermissionMapper;
import com.haunguyen.hello_spring_boot.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);

        permission = permissionRepository.save(permission);

        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll(){
        var permission = permissionRepository.findAll();

        return permission.stream().map(p -> permissionMapper.toPermissionResponse(p)).toList();
    }

    public void delete(String permission){
        permissionRepository.deleteById(permission);
    }
}
