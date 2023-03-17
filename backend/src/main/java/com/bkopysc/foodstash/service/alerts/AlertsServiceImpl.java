package com.bkopysc.foodstash.service.alerts;

import com.bkopysc.foodstash.domain.*;
import com.bkopysc.foodstash.dto.alerts.AlertDetailsDto;
import com.bkopysc.foodstash.repository.AlertRepository;
import com.bkopysc.foodstash.repository.FoodRepository;
import com.bkopysc.foodstash.repository.StashRepository;
import com.bkopysc.foodstash.repository.StorageRepository;
import com.bkopysc.foodstash.service.storages.StoragesService;
import com.bkopysc.foodstash.service.users.UserService;
import com.bkopysc.foodstash.utils.calcs.FoodAlertCalcUtil;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
public class AlertsServiceImpl implements AlertsService {

    private final AlertRepository alertRepository;
    private final StorageRepository storageRepository;
    private final StashRepository stashRepository;
    private final FoodRepository foodRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private static final FoodAlertCalcUtil foodAlertCalcUtil = new FoodAlertCalcUtil();

    private final String USER_NOT_ALLOWED = "user.auth.error.notAllowed";

    private  final String STORAGE_NOT_FOUND = "storages.error.notExist";

    @Override
    public AlertDetailsDto executeAndGetAlertForced(Long storageId, Authentication authentication) {
        User user = userService.getCurrentUser(authentication);
        Storage storage = storageRepository.findById(storageId).orElseThrow(() -> new BadRequestException("storage doesnt exists"));

        Stash stash = stashRepository.findByStorages(storage);
        if (stash.getUsedByUsers().stream().noneMatch(user1 -> user1.getId().equals(user.getId()))) {
            throw new BadRequestException(USER_NOT_ALLOWED);
        }

        return executeAndGetAlert(storageId, true);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AlertDetailsDto executeAndGetAlert(Long storageId, boolean forceExecute) {

        Storage storage = storageRepository.findById(storageId)
                .orElseThrow(() -> new BadRequestException(STORAGE_NOT_FOUND));

        Alert alert = storage.getAlert();

        //execute calculations if not exists or if it is a new day
        if (compareDates(alert) || forceExecute) {
            List<Food> foodList = foodRepository.getActiveFoodsByStorageId(storageId);
            long alertCount = 0;

            for (Food food : foodList) {
                if (foodAlertCalcUtil.calcIfAlert(food)) {
                    alertCount += 1;
                    food.setAlerted(true);
                }
            }
            alert.setCheckDate(new Date());
            alert.setNumberOfAlerts(alertCount);
            alert.setStorage(storage);
            storage.setAlert(alert);

            alertRepository.save(alert);
            foodRepository.saveAll(foodList);
            storageRepository.save(storage);
        }

        return modelMapper.map(alert, AlertDetailsDto.class);
    }

    //only use in FoodServiceImpl
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Alert recalculateForNewFood(Set<Food> foods, Storage storage) {

        Alert alert = storage.getAlert();

        long alertCount = alert.getNumberOfAlerts();

        for (Food food : foods) {
            //it was calculated when added food in FoodService
            if (food.isAlerted()) {
                alertCount += 1;
            }
        }

        alert.setCheckDate(new Date());
        alert.setNumberOfAlerts(alertCount);
        alertRepository.save(alert);

        return alert;
    }

    @Override
    public void recalculateForMovedFood(Set<Food> foodSet) {


        Map<Long, Alert> alertMap = new HashMap<>();

        for (Food food : foodSet) {

            if (food.isAlerted()) {
                Storage storage = food.getStorage();
                if (!alertMap.containsKey(storage.getAlert().getId())) {
                    alertMap.put(storage.getAlert().getId(), storage.getAlert());
                }

                Alert alert = alertMap.get(storage.getAlert().getId());

                long subResult = alert.getNumberOfAlerts() - 1;
                alert.setNumberOfAlerts(subResult > 0 ? subResult : 0);
                alertMap.replace(alert.getId(), alert);
            }
        }

        alertRepository.saveAll(alertMap.values());

    }

    @Override
    public void recalculateForRecoverFood(Set<Food> foodSet){

        Map<Long, Alert> alertMap = new HashMap<>();

        for (Food food : foodSet) {
            if (food.isAlerted()) {
                Storage storage = food.getStorage();
                if (!alertMap.containsKey(storage.getAlert().getId())) {
                    alertMap.put(storage.getAlert().getId(), storage.getAlert());
                }

                Alert alert = alertMap.get(storage.getAlert().getId());

                long subResult = alert.getNumberOfAlerts() + 1;
                alert.setNumberOfAlerts(subResult);
                alertMap.replace(alert.getId(), alert);
            }
        }
        alertRepository.saveAll(alertMap.values());
    }


    @Override
    public boolean recalculateForEditFood(Food food, boolean isAlertedBefore) {
        if (isAlertedBefore != food.isAlerted()) {
            Alert alert = food.getStorage().getAlert();
            long subResult = alert.getNumberOfAlerts();
            if (isAlertedBefore) {
                subResult -= 1;
            } else {
                subResult += 1;
            }
            alert.setNumberOfAlerts(subResult > 0 ? subResult : 0);
            alertRepository.save(alert);
            return true;
        }
        return false;
    }

    private boolean compareDates(Alert alert) {
        if (alert.getCheckDate() == null) {
            return true;
        }


        Instant alertInstant = alert.getCheckDate().toInstant().truncatedTo(ChronoUnit.DAYS);
        Instant todayInstant = new Date().toInstant().truncatedTo(ChronoUnit.DAYS);


        return !alertInstant.equals(todayInstant);

    }

}
