package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.dto.statistics.StorageStatisticsDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsInfoDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsPostDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsSimpleDto;
import com.bkopysc.foodstash.service.statistics.StorageStatisticsService;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/statistics")
@PreAuthorize("hasRole('USER')")
public class StatisticsController {

    private final StorageStatisticsService storageStatisticsService;

    @PostMapping("/generate/storage/{storageId}")
    public ResponseEntity<StorageStatisticsDto> generateAndGetStorageStatistics(@PathVariable Long storageId,
                                                                                @Valid @RequestBody StorageStatisticsPostDto postDto,
                                                                                Authentication authentication){
        return ResponseEntity.ok(storageStatisticsService.generateAndGetStatistics(storageId, postDto, authentication));
    }

    @GetMapping("storage/{storageId}")
    public ResponseEntity<StorageStatisticsDto> getOneStatistic(@PathVariable Long storageId, Authentication authentication){
        return ResponseEntity.ok(storageStatisticsService.getOneStatistics(storageId,authentication));
    }

    @GetMapping("/list/storage/{storageId}")
    public ResponseEntity<List<StorageStatisticsSimpleDto>> getStatisticsList(@PathVariable Long storageId, Authentication authentication){
        return ResponseEntity.ok(storageStatisticsService.getStatisticsSimpleList(storageId,authentication));
    }



    @GetMapping("overall/storage/{storageId}")
    public ResponseEntity<StorageStatisticsInfoDto> getOverallInfo(@PathVariable Long storageId, Authentication authentication){
        return ResponseEntity.ok(storageStatisticsService.getOverallInfo(storageId, authentication));
    }
}
