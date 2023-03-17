package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.dashboard.DashboardSimpleDto;
import com.bkopysc.foodstash.service.dashboard.DashboardService;
import com.bkopysc.foodstash.service.users.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('USER')")
public class DashboardController {

    private final DashboardService dashboardService;


    @GetMapping("/simple")
    public ResponseEntity<DashboardSimpleDto> getSimpleDashboardInfo(Authentication authentication){
        return ResponseEntity.ok(dashboardService.getDashboardSimple(authentication));
    }
}
