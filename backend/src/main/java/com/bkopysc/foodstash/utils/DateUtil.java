package com.bkopysc.foodstash.utils;

import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@NoArgsConstructor
public class DateUtil {

    public String formatDateToString(Date date, String pattern){
        if(pattern == ""){
            pattern = "MM-dd-yyyy";
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        return simpleDateFormat.format(date);
    }

    public Date calculateExpiryDateForToken(int expirationMinutes){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Timestamp(calendar.getTime().getTime()));
        calendar.add(Calendar.MINUTE, expirationMinutes);
        return new Date(calendar.getTime().getTime());
    }
}
