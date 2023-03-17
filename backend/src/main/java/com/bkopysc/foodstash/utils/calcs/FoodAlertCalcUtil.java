package com.bkopysc.foodstash.utils.calcs;

import com.bkopysc.foodstash.domain.Food;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class FoodAlertCalcUtil {

    public FoodAlertCalcUtil(){

    }

    public boolean calcIfAlert(Food food) {
        Date currentDate = new Date();
        Date foodDate = food.getExpirationDate();

        long timeLeft = foodDate.getTime() - currentDate.getTime();
        long diff = TimeUnit.DAYS.convert(timeLeft, TimeUnit.MILLISECONDS);
        int diffInt = (int) diff;

        //alert 3 days before
        if(diffInt <= 3){
            return true;
        } else {
            return false;
        }
    }
}
