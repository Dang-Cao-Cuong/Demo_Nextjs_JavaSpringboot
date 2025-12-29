package com.haunguyen.hello_spring_boot.mapper;

import com.haunguyen.hello_spring_boot.dto.request.GroupRequest;
import com.haunguyen.hello_spring_boot.dto.request.PermissionRequest;
import com.haunguyen.hello_spring_boot.dto.response.GroupResponse;
import com.haunguyen.hello_spring_boot.dto.response.PermissionResponse;
import com.haunguyen.hello_spring_boot.entity.Group;
import com.haunguyen.hello_spring_boot.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GroupMapper {

    Group toGroup
            (GroupRequest request);

    GroupResponse toGroupResponse(Group group);
}
