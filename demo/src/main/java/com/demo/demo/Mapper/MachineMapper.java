package com.demo.demo.Mapper;

import com.demo.demo.Dto.Request.MachineRequest;
import com.demo.demo.Dto.Response.MachineResponse;
import com.demo.demo.Entity.CncMachine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MachineMapper {
    CncMachine toMachine(MachineRequest request);

    MachineResponse toMachineResponse(CncMachine machine);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateMachine(@MappingTarget CncMachine machine, MachineRequest request);
}
