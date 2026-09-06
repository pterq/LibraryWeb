package com.example.librarywebbackend.controller;

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
    public List<Fee> getAll() {
        return feeService.getAllFees();
    }

    @GetMapping("/counts")
    public List<FeeWithCountDTO> getFeeCounts() {
        return feeService.getAllUsersFeeCounts();
    }

    @GetMapping("/userFees/{userId}")
    public List<Fee> getFeesByUserId(@PathVariable Long userId) {
        return feeService.getUserFessByUserId(userId);
    }

    /*
    @GetMapping("/status/{status}")
    public List<Fee> getByStatus(@PathVariable FeeStatus status) {
        return feeService.getFeesByStatus(status);
    }
    */
    @GetMapping("/{id}")
    public ResponseEntity<Fee> getById(@PathVariable Long id) {
        Fee fee = feeService.getFeeByFeeId(id);
        return fee != null
                ? ResponseEntity.ok(fee)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Fee create(@RequestBody Fee fee) {
        return feeService.createFee(fee);
    }

    /*
    @PostMapping("/pay/{id}")
    public ResponseEntity<Fee> pay(@PathVariable Long id) {
        Fee fee = feeService.payFee(id);
        return fee != null
                ? ResponseEntity.ok(fee)
                : ResponseEntity.notFound().build();
    }
    */
    @PatchMapping("/{id}/{status}")
    public ResponseEntity<Fee> updateStatus(@PathVariable Long id, @PathVariable FeeStatus status) {
        Fee fee = feeService.updateFeeStatus(id, status);
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
