package com.bkopysc.foodstash.service.dashboard;

import com.bkopysc.foodstash.dto.dashboard.DashboardSimpleDto;
import org.springframework.security.core.Authentication;

public interface DashboardService {

    DashboardSimpleDto getDashboardSimple(Authentication authentication);
}
