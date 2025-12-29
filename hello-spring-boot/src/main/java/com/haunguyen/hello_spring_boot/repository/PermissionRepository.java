package com.haunguyen.hello_spring_boot.repository;

import com.haunguyen.hello_spring_boot.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

}
