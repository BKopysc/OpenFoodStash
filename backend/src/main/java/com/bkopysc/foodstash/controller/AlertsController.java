package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.SimpleResponse;
import com.bkopysc.foodstash.dto.alerts.AlertDetailsDto;
import com.bkopysc.foodstash.service.alerts.AlertsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/alerts")
@PreAuthorize("hasRole('USER')")
public class AlertsController {

    private final AlertsService alertsService;

    @PostMapping("/storage/{storageId}")
    ResponseEntity<AlertDetailsDto> forceStorageAlertExecute(@PathVariable Long storageId, Authentication authentication){
        return ResponseEntity.ok(alertsService.executeAndGetAlertForced(storageId,authentication));
    }
}
