package com.bkopysc.foodstash.service.statistics;

import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.domain.StorageStatisticsGeneratedJson;
import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsInfoDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsPostDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsSimpleDto;
import org.springframework.security.core.Authentication;

import java.util.Date;
import java.util.List;


public interface StorageStatisticsService {

    StorageStatisticsGeneratedJson generateStatisticsJsonFromStorage(Storage storage, Date startDate, Date endDate);
    StorageStatisticsDto generateAndGetStatistics(Long storageId, StorageStatisticsPostDto postDto, Authentication authentication);

    StorageStatisticsInfoDto getOverallInfo(Long storageId, Authentication authentication);
    List<StorageStatisticsSimpleDto> getStatisticsSimpleList(Long storageId, Authentication authentication);
    StorageStatisticsDto getOneStatistics(Long statisticId, Authentication authentication);
    StorageStatisticsDto getLastStatistics(Long storageId, Authentication authentication);
}
