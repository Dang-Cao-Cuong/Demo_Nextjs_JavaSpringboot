package com.demo.demo.Repository;

import com.demo.demo.Entity.CncMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CncMachineRepository extends JpaRepository<CncMachine, UUID> {

}
