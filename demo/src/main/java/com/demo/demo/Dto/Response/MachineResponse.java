package com.demo.demo.Dto.Response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class MachineResponse {
    UUID id;
    String name;
    String model;
    String location;
    String status;
    Integer manufactureYear;
}
