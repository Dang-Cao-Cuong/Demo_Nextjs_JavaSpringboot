package com.haunguyen.hello_spring_boot.repository;

import com.haunguyen.hello_spring_boot.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, String> {
}
