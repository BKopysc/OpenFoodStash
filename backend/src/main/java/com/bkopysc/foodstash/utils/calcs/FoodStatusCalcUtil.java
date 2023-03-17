package com.bkopysc.foodstash.utils.calcs;

import com.bkopysc.foodstash.domain.EFoodStatus;
import com.bkopysc.foodstash.domain.EStorageType;
import com.bkopysc.foodstash.domain.Food;
import com.bkopysc.foodstash.dto.foodCategories.FoodCategoryDetailsDto;
import com.bkopysc.foodstash.dto.foods.FoodDetailsDto;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class FoodStatusCalcUtil {

    public FoodStatusCalcUtil() {
    }

    public Date predictDate(Double freshScore, boolean isOpened, String foodCategory, EStorageType storageType) {
        //foodCategory can be later changed to Enum
        double freshScoreScaled = freshScore / 5;
        double maxDays;
        LocalDate finalDate;

        switch (foodCategory.toLowerCase()) {
            case "drink":
                if (storageType.equals(EStorageType.FRIDGE) && isOpened) {
                    maxDays = 4 * freshScoreScaled;
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 30 * 9 * freshScoreScaled;
                } else if (isOpened) {
                    maxDays = 2;
                } else {
                    maxDays = 30 * 9 * freshScoreScaled;
                }
                break;

            case "sauce":
                if (storageType.equals(EStorageType.FRIDGE) && isOpened) {
                    maxDays = 6 * 30 * freshScoreScaled;
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 12 * 30 * freshScoreScaled;
                } else if (isOpened) {
                    maxDays = 5 * freshScoreScaled;
                } else {
                    maxDays = 12 * 30 * freshScoreScaled;
                }
                break;

            case "meat":
                if (storageType.equals(EStorageType.FRIDGE)) {
                    if (isOpened) {
                        maxDays = 4 * freshScoreScaled;
                    } else {
                        maxDays = 14 * freshScoreScaled;
                    }
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 2 * 30 * freshScoreScaled;
                } else {
                    maxDays = 1;
                }
                break;

            case "bread":
                if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 3 * 30 * freshScoreScaled;
                } else if (isOpened) {
                    maxDays = 4 * freshScoreScaled;
                } else {
                    maxDays = 5 * freshScoreScaled;
                }
                break;

            case "dairy":
                if (storageType.equals(EStorageType.FRIDGE)) {
                    if (isOpened) {
                        maxDays = 7 * freshScoreScaled;
                    } else {
                        maxDays = 14 * freshScoreScaled;
                    }
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 2 * 30 * freshScoreScaled;
                } else {
                    maxDays = 2;
                }
                break;

            case "vegetable":
                if (storageType.equals(EStorageType.FRIDGE)) {
                    maxDays = 14 * freshScoreScaled;
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 6 * 30 * freshScoreScaled;
                } else {
                    maxDays = 8 * freshScoreScaled;
                }
                break;

            case "fruit":
                if (storageType.equals(EStorageType.FRIDGE)) {
                    maxDays = 10 * freshScoreScaled;
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 6 * 30 * freshScoreScaled;
                } else {
                    maxDays = 5 * freshScoreScaled;
                }
                break;

            case "meal":
                if (storageType.equals(EStorageType.FRIDGE)) {
                    if(isOpened){
                        maxDays = 3 * freshScoreScaled;
                    } else {
                        maxDays = 5 * freshScoreScaled;
                    }
                } else if (storageType.equals(EStorageType.FREEZER)) {
                    maxDays = 2 * 30 * freshScoreScaled;
                } else {
                    maxDays = 2 * freshScoreScaled;
                }
                break;

            case "sweets":
                maxDays = 6 * 30 * freshScoreScaled;
                break;

            default:
                maxDays = 10 * freshScoreScaled;
                break;
        }

        finalDate = LocalDate.now().plusDays((int) (Math.ceil(maxDays)));

        return Date.from(finalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public EFoodStatus calcStatus(FoodDetailsDto foodDetailsDto) {

        Date startDate = new Date();
        Date endDate = foodDetailsDto.getExpirationDate();
        FoodCategoryDetailsDto category = foodDetailsDto.getFoodCategoryDetailsDto();

        long timeLeft = endDate.getTime() - startDate.getTime();
        long diff = TimeUnit.DAYS.convert(timeLeft, TimeUnit.MILLISECONDS);
        int diffInt = (int) diff;

        if (category.isStrongExpirationDate()) {
            if (diffInt < 0) {
                return EFoodStatus.SPOILED;
            } else if (diffInt <= 2) {
                return EFoodStatus.NOTFRESH;
            } else if (diffInt < 4) {
                return EFoodStatus.GOOD;
            } else {
                return EFoodStatus.FRESH;
            }
        } else {
            if (diffInt < 0) {
                return EFoodStatus.TOTRY;
            } else if (diffInt == 0) {
                return EFoodStatus.NOTFRESH;
            } else if (diffInt < 4) {
                return EFoodStatus.GOOD;
            } else {
                return EFoodStatus.FRESH;
            }
        }
    }
}
