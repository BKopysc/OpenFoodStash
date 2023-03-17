package com.bkopysc.foodstash.service.statistics;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsInfoDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsSimpleDto;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticActualInfo;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticCategoryCount;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticCount;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsDto;
import com.bkopysc.foodstash.dto.statistics.StorageStatisticsPostDto;
import com.bkopysc.foodstash.repository.FoodRepository;
import com.bkopysc.foodstash.repository.StorageStatisticsRepository;
import com.bkopysc.foodstash.repository.statisticRepositoryInterfaces.IStorageStatisticSimple;
import com.bkopysc.foodstash.service.storages.StoragesService;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.utils.DateUtil;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StorageStatisticsServiceImpl implements  StorageStatisticsService{

    private final int MAX_STATS_ENTRIES = 5;
    private final StoragesService storagesService;
    private final UserService userService;
    private final StorageStatisticsRepository storageStatisticsRepository;
    private final FoodRepository foodRepository;
    private final ModelMapper modelMapper;

    private static final DateUtil dateUtil = new DateUtil();

    private final String INVALID_DATE_RANGE = "statistics.error.dateRange";
    private final String STAT_NOT_EXIST = "statistics.error.notExist";

    @Override
    public StorageStatisticsGeneratedJson generateStatisticsJsonFromStorage(Storage storage, Date startDate, Date endDate) {



        StorageStatisticsGeneratedJson generatedJson = new StorageStatisticsGeneratedJson();
        String genName = storage.getName();
        generatedJson.setName(genName);
        generatedJson.setStorageName(storage.getName());
        generatedJson.setStartDate(startDate);


        generatedJson.setEndDate(endDate);

        IStorageStatisticCount statisticCount = storageStatisticsRepository
                .getStorageStatisticCount(storage.getId(), startDate, endDate);

        if(statisticCount == null){
            return null; //TODO: storage generator
        }

        if(statisticCount.getEaten() + statisticCount.getInTrash() + statisticCount.getAdded() + statisticCount.getDeleted() +
                statisticCount.getWasted() + statisticCount.getEatenAfter() == 0){
            return null;
        }


        Map<EStatisticFoodAction, Long> mapForActions = new HashMap<>();

        mapForActions.put(EStatisticFoodAction.ADDED, statisticCount.getAdded());
        mapForActions.put(EStatisticFoodAction.DELETED, statisticCount.getDeleted());
        mapForActions.put(EStatisticFoodAction.WASTED, statisticCount.getWasted());
        mapForActions.put(EStatisticFoodAction.EATEN, statisticCount.getEaten());
        mapForActions.put(EStatisticFoodAction.IN_TRASH, statisticCount.getInTrash());
        mapForActions.put(EStatisticFoodAction.EATEN_AFTER, statisticCount.getEatenAfter());

        generatedJson.setFoodActionsStats(mapForActions);

        List<IStorageStatisticCategoryCount> statisticCategoryCount = storageStatisticsRepository
                .getStorageStatisticCategoryCount(storage.getId(), startDate, endDate);


        for(IStorageStatisticCategoryCount sscc: statisticCategoryCount){
            if(sscc.getAdded() > 0) {
                if(generatedJson.getNumberOfAddedByCategory() == null){
                    generatedJson.setNumberOfAddedByCategory(new HashMap<>());
                }
                generatedJson.getNumberOfAddedByCategory().put(sscc.getCategoryName(), sscc.getAdded());
            }
            if(sscc.getEaten() > 0) {
                if(generatedJson.getNumberOfEatenByCategory() == null){
                    generatedJson.setNumberOfEatenByCategory(new HashMap<>());
                }
                generatedJson.getNumberOfEatenByCategory().put(sscc.getCategoryName(), sscc.getEaten());
            }
            if(sscc.getWasted() > 0) {
                if(generatedJson.getNumberOfWastedByCategory() == null){
                    generatedJson.setNumberOfWastedByCategory(new HashMap<>());
                }
                generatedJson.getNumberOfWastedByCategory().put(sscc.getCategoryName(), sscc.getWasted());
            }
            if(sscc.getInTrash() > 0) {
                if(generatedJson.getNumberOfMovedToTrashByCategory() == null){
                    generatedJson.setNumberOfMovedToTrashByCategory(new HashMap<>());
                }
                generatedJson.getNumberOfMovedToTrashByCategory().put(sscc.getCategoryName(), sscc.getInTrash());
            }
            if(sscc.getEatenAfter() > 0) {
                if(generatedJson.getNumberOfEatenAfterExpiredByCategory() == null){
                    generatedJson.setNumberOfEatenAfterExpiredByCategory(new HashMap<>());
                }
                generatedJson.getNumberOfEatenAfterExpiredByCategory().put(sscc.getCategoryName(), sscc.getEatenAfter());
            }
        }



        generatedJson.setMostFreqAddedCategory(getMapWithHighestValues(generatedJson.getNumberOfAddedByCategory()));
        generatedJson.setMostFreqWastedCategory(getMapWithHighestValues(generatedJson.getNumberOfWastedByCategory()));
        generatedJson.setMostFreqEatenCategory(getMapWithHighestValues(generatedJson.getNumberOfEatenByCategory()));
        generatedJson.setMostFreqMoveToTrashCategory(getMapWithHighestValues(generatedJson.getNumberOfMovedToTrashByCategory()));
        generatedJson.setMostFreqEatenAfterExpiredCategory(getMapWithHighestValues(generatedJson.getMostFreqEatenAfterExpiredCategory()));

        generatedJson.setMostFreqFoodActions(getActionMapWithHighestValue(generatedJson.getFoodActionsStats()));


        if(statisticCount.getEaten() > statisticCount.getInTrash()){
            generatedJson.setTipOpinion(EStatisticTipOpinion.GOOD);
        } else if(statisticCount.getEaten() < statisticCount.getInTrash()) {
            generatedJson.setTipOpinion(EStatisticTipOpinion.BAD);
        } else if(statisticCount.getEaten() == 0 && statisticCount.getInTrash() == 0){
            generatedJson.setTipOpinion(EStatisticTipOpinion.NEUTRAL_ZERO);
        } else{
            generatedJson.setTipOpinion(EStatisticTipOpinion.NEUTRAL);
        }

        return generatedJson;
    }



    private Map<String, Long> getMapWithHighestValues(Map<String,Long> currentMap){
        if(currentMap == null){
            return null;
        }

        long maxValue = Collections.max(currentMap.values());


        if(maxValue == 0){
            return null;
        }
        return currentMap.entrySet().stream()
                .filter(stringLongEntry -> stringLongEntry.getValue() == maxValue)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private Map<EStatisticFoodAction, Long> getActionMapWithHighestValue(Map<EStatisticFoodAction, Long> currentMap){
        if(currentMap == null){
            return null;
        }

        long maxValue = Collections.max(currentMap.values());

        if(maxValue == 0){
            return null;
        }
        return currentMap.entrySet().stream()
                .filter(stringLongEntry -> stringLongEntry.getValue() == maxValue)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public StorageStatisticsDto generateAndGetStatistics(Long storageId, StorageStatisticsPostDto postDto, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Storage storage = this.storagesService.getRawUserStorage(authentication, storageId);

        if(!rangeDatesValidation(postDto.getStartDate(), postDto.getEndDate())){
            throw new BadRequestException(INVALID_DATE_RANGE);
        }

        StorageStatistics storageStatistics = new StorageStatistics();
        storageStatistics.setStorage(storage);
        storageStatistics.setStartDate(postDto.getStartDate());
        storageStatistics.setEndDate(postDto.getEndDate());

        StorageStatisticsGeneratedJson generatedJson =  this.generateStatisticsJsonFromStorage(storage, postDto.getStartDate(), postDto.getEndDate());
        storageStatistics.setGeneratedData(generatedJson);

        if(generatedJson != null){
            checkAndDelNumberOfCurrentEntries(storageId);
            this.storageStatisticsRepository.save(storageStatistics);
        }

        return modelMapper.map(storageStatistics, StorageStatisticsDto.class);
    }

    private void checkAndDelNumberOfCurrentEntries(Long storageId){
        List<IStorageStatisticSimple> storageStatistics = this.storageStatisticsRepository
                .findAllByStorage_IdOrderByCreationDateDesc(storageId, Pageable.unpaged());

        int size = storageStatistics.size();

        if(size >= MAX_STATS_ENTRIES){
            List<IStorageStatisticSimple> statsToDelete = storageStatistics.subList(MAX_STATS_ENTRIES-1, size);
            Set<Long> idsToDelete = statsToDelete.stream().map(IStorageStatisticSimple::getId).collect(Collectors.toSet());
            this.storageStatisticsRepository.deleteAllByIdInBatch(idsToDelete);
        }
    }

    @Override
    public StorageStatisticsInfoDto getOverallInfo(Long storageId, Authentication authentication) {
        Storage storage = this.storagesService.getRawUserStorage(authentication, storageId);

        IStorageStatisticActualInfo storageStatisticActualInfo = storageStatisticsRepository.getStorageStatisticActualInfo(storageId);

        if(storageStatisticActualInfo == null){
            return  null;
        }

        return StorageStatisticsInfoDto.builder()
                .allActiveFood(storageStatisticActualInfo.getAllActiveFood())
                .allAddedFood(storageStatisticActualInfo.getAllAddedFood())
                .allEatenFood(storageStatisticActualInfo.getAllEatenFood())
                .allAlertedFood(storageStatisticActualInfo.getAllAlertedFood())
                .allDeleted(storageStatisticActualInfo.getAllDeleted())
                .allInTrash(storageStatisticActualInfo.getAllInTrash())
                .build();
    }


    @Override
    public List<StorageStatisticsSimpleDto> getStatisticsSimpleList(Long storageId, Authentication authentication) {

        List<IStorageStatisticSimple> storageStatisticsIdsList = storageStatisticsRepository
                .findAllByStorage_IdOrderByCreationDateDesc(storageId, PageRequest.of(0,MAX_STATS_ENTRIES));

        List<StorageStatistics> storageStatisticsList = storageStatisticsRepository.findAllById(
                storageStatisticsIdsList.stream().map(IStorageStatisticSimple::getId).collect(Collectors.toSet())
        );

        return storageStatisticsList.stream()
                .map(storageStatistics -> modelMapper.map(storageStatistics, StorageStatisticsSimpleDto.class))
                .toList();
    }

    @Override
    public StorageStatisticsDto getOneStatistics(Long statisticId, Authentication authentication) {

        StorageStatistics storageStatistics = storageStatisticsRepository.findById(statisticId).orElseThrow(
                () -> new BadRequestException(STAT_NOT_EXIST));

        storagesService.getRawUserStorage(authentication, storageStatistics.getStorage().getId());

        return modelMapper.map(storageStatistics, StorageStatisticsDto.class);
    }

    private boolean rangeDatesValidation(Date startDate, Date endDate){
        if(startDate == null || endDate == null){
            return false;
        }

        long diffInMilis = Math.abs(startDate.getTime() - endDate.getTime());
        long diff = TimeUnit.DAYS.convert(diffInMilis, TimeUnit.MILLISECONDS);

        //max stats range = 500 days
        return diff <= 500;
    }

    @Override
    public StorageStatisticsDto getLastStatistics(Long storageId, Authentication authentication) {
        return null;
    }
}
