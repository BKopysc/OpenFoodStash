package com.bkopysc.foodstash.utils;

import com.google.common.hash.Hashing;

import java.nio.charset.StandardCharsets;
import java.util.Random;

public class HashUtil {

    public String getSha256(String input){

        String finalString = input + getRandomString();

        return Hashing
                .sha256()
                .hashString(finalString, StandardCharsets.UTF_8)
                .toString();
    }

    private String getRandomString(){
        int leftLimit = 97; //a
        int rightLimit = 122; //z
        int targetStringLength = 10;
        Random random = new Random();
        StringBuilder buffer = new StringBuilder(targetStringLength);
        for (int i = 0; i < targetStringLength; i++) {
            int randomLimitedInt = leftLimit + (int)
                    (random.nextFloat() * (rightLimit - leftLimit + 1));
            buffer.append((char) randomLimitedInt);
        }
        return buffer.toString();
    }
}
