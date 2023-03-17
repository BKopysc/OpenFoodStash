package com.bkopysc.foodstash.utils;

import java.util.UUID;

public class RandomStringGenerator {

    public String getRandomUUID(){
        UUID randomUUID = UUID.randomUUID();
        return randomUUID.toString().replaceAll("-","");
    }
}
