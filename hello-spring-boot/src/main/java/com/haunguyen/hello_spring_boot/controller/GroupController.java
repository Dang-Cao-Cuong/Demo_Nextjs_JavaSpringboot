package com.haunguyen.hello_spring_boot.controller;

import com.haunguyen.hello_spring_boot.Service.GroupService;
import com.haunguyen.hello_spring_boot.dto.request.ApiResponse;
import com.haunguyen.hello_spring_boot.dto.request.GroupRequest;
import com.haunguyen.hello_spring_boot.dto.request.PermissionRequest;
import com.haunguyen.hello_spring_boot.dto.response.GroupResponse;
import com.haunguyen.hello_spring_boot.dto.response.PermissionResponse;
import com.haunguyen.hello_spring_boot.repository.GroupRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GroupController {

    GroupRepository groupRepository;
    GroupService groupService;

    @PostMapping
    ApiResponse<GroupResponse> create(@RequestBody GroupRequest request){
        return ApiResponse.<GroupResponse>builder()
                .result(groupService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<GroupResponse>> getAll(){
        return ApiResponse.<List<GroupResponse>>builder()
                .result(groupService.getAll())
                .build();
    }

    @DeleteMapping("/{group}")
    ApiResponse<Void> delete(@PathVariable String group){
        groupService.delete(group);
        return ApiResponse.<Void>builder().build();
    }
}
