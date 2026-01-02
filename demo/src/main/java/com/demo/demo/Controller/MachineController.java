package com.demo.demo.Controller;

import com.demo.demo.Dto.Request.MachineRequest;
import com.demo.demo.Dto.Response.ApiResponse;
import com.demo.demo.Dto.Response.MachineResponse;
import com.demo.demo.Service.Impl.MachineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @PostMapping
    ApiResponse<MachineResponse> create(@RequestBody @Valid MachineRequest request) {
        return ApiResponse.<MachineResponse>builder()
                .result(machineService.createMachine(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<MachineResponse>> getAll() {
        return ApiResponse.<List<MachineResponse>>builder()
                .result(machineService.getAllMachines())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<MachineResponse> getById(@PathVariable String id) {
        return ApiResponse.<MachineResponse>builder()
                .result(machineService.getMachineById(id))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<MachineResponse> update(@PathVariable String id, @RequestBody @Valid MachineRequest request) {
        return ApiResponse.<MachineResponse>builder()
                .result(machineService.updateMachine(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable String id) {
        machineService.deleteMachine(id);
        return ApiResponse.<Void>builder()
                .message("Xóa máy thành công")
                .build();
    }
}
