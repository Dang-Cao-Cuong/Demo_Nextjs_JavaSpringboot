package com.demo.demo.Service.Simulation;



import com.demo.demo.Dto.Response.MachineErrorNotification;
import com.demo.demo.Entity.CncMachine;
import com.demo.demo.Enums.MachineStatus;
import com.demo.demo.Repository.CncMachineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate; // <--- Import quan trọng
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MachineSimulationService {

    private final CncMachineRepository machineRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();


    @Scheduled(fixedRateString = "${app.simulation.interval}")
    @Transactional
    public void simulateMachineStatus() {
        log.info("Job run...");

        List<CncMachine> machines = machineRepository.findAll();
        if (machines.isEmpty()) return;

        for (CncMachine machine : machines) {
            MachineStatus oldStatus = machine.getStatus();
            MachineStatus newStatus = getRandomStatus();

            if (oldStatus != newStatus) {
                machine.setStatus(newStatus);
                log.info("Máy: {} | {} -> {}", machine.getName(), oldStatus, newStatus);

                if (newStatus == MachineStatus.ERROR) {
                    sendErrorNotification(machine);
                }
            }
        }
        machineRepository.saveAll(machines);
    }

    private void sendErrorNotification(CncMachine machine) {
        log.error("Warning: Máy {} gặp sự cố! Đang gửi cảnh báo...", machine.getName());


        MachineErrorNotification notification = MachineErrorNotification.builder()
                .machineId(machine.getId())
                .machineName(machine.getName())
                .message("Warning: Máy " + machine.getName() + " vừa chuyển sang trạng thái ERROR!")
                .timestamp(LocalDateTime.now())
                .build();


        messagingTemplate.convertAndSend("/topic/errors", notification);
    }

    private MachineStatus getRandomStatus() {

        MachineStatus[] statuses = MachineStatus.values();
        return statuses[random.nextInt(statuses.length)];
    }
}
