package com.demo.demo.Service.Impl;

import com.demo.demo.Dto.Request.MachineRequest;
import com.demo.demo.Dto.Response.MachineResponse;
import com.demo.demo.Entity.CncMachine;
import com.demo.demo.Mapper.MachineMapper;
import com.demo.demo.Repository.MachineRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MachineService {

    MachineRepository machineRepository;
    MachineMapper machineMapper;

    public MachineResponse createMachine(MachineRequest request) {
        if (machineRepository.existsByName(request.getName())) {
            throw new RuntimeException("Machine name already exists");
        }
        CncMachine machine = machineMapper.toMachine(request);
        return machineMapper.toMachineResponse(machineRepository.save(machine));
    }

    public List<MachineResponse> getAllMachines() {
        return machineRepository.findAll().stream()
                .map(machineMapper::toMachineResponse)
                .toList();
    }

    public MachineResponse getMachineById(String id) {
        return machineMapper.toMachineResponse(findMachineById(id));
    }

    public MachineResponse updateMachine(String id, MachineRequest request) {
        CncMachine machine = findMachineById(id);
        machineMapper.updateMachine(machine, request);
        return machineMapper.toMachineResponse(machineRepository.save(machine));
    }

    public void deleteMachine(String id) {
        CncMachine machine = findMachineById(id);
        // Khi gọi hàm này, nhờ @SQLDelete, nó sẽ bắn câu lệnh UPDATE ... SET deleted=true
        machineRepository.delete(machine);
    }

    // Hàm phụ trợ để tìm và check lỗi
    private CncMachine findMachineById(String id) {
        try {
            return machineRepository.findById(UUID.fromString(id))
                    .orElseThrow(() -> new RuntimeException("Machine not found"));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid UUID format");
        }
    }
}
