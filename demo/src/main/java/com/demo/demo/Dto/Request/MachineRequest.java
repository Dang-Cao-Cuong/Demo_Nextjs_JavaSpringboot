package com.demo.demo.Dto.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MachineRequest {

    @NotBlank(message = "MACHINE_NAME_INVALID")
    String name;

    @NotBlank(message = "MODEL_INVALID")
    String model;

    String location;

    String status;

    Integer manufactureYear;
}
