package com.bkopysc.foodstash.service.alerts;

import com.bkopysc.foodstash.domain.Alert;
import com.bkopysc.foodstash.domain.Food;
import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.dto.alerts.AlertDetailsDto;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Set;

public interface AlertsService {



    AlertDetailsDto executeAndGetAlertForced(Long storageId, Authentication authentication);

    AlertDetailsDto executeAndGetAlert(Long storageId, boolean forceExecute);
    Alert recalculateForNewFood(Set<Food> foods, Storage storage);
    void recalculateForMovedFood(Set<Food> foodSet);

    void recalculateForRecoverFood(Set<Food> foodSet);

    boolean recalculateForEditFood(Food food, boolean isAlertedBefore);
}
