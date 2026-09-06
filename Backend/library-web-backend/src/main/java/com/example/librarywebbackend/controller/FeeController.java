package com.example.librarywebbackend.controller;

import com.example.librarywebbackend.dto.FeeRequestDTO;
import com.example.librarywebbackend.dto.FeeResponseDTO;
import com.example.librarywebbackend.dto.FeeWithCountDTO;
import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import com.example.librarywebbackend.service.IFeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fees")
public class FeeController {

    private final IFeeService feeService;

    public FeeController(IFeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    public List<FeeResponseDTO> getAll() {
        return feeService.getAllFees();
    }

    @GetMapping("/counts")
    public List<FeeWithCountDTO> getFeeCounts() {
        return feeService.getAllUsersFeeCounts();
    }

    @GetMapping("/userFees/{userId}")
    public List<FeeResponseDTO> getFeesByUserId(@PathVariable Long userId) {
        return feeService.getUserFeesByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeResponseDTO> getById(@PathVariable Long id) {
        FeeResponseDTO fee = feeService.getFeeByFeeId(id);
        return fee != null
                ? ResponseEntity.ok(fee)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public FeeResponseDTO create(@RequestBody FeeRequestDTO dto) {
        return feeService.createFee(dto);
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<FeeResponseDTO> updateStatus(@PathVariable Long id, @PathVariable FeeStatus status) {
        FeeResponseDTO fee = feeService.updateFeeStatus(id, status);
        return fee != null
                ? ResponseEntity.ok(fee)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feeService.deleteFeeByFeeId(id);
        return ResponseEntity.noContent().build();
    }
}

