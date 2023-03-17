package com.bkopysc.foodstash.security;

import com.bkopysc.foodstash.domain.Storage;
import com.bkopysc.foodstash.dto.storages.StorageComplexDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

//SET ALLOWED ORIGINS

    @Bean
    public WebMvcConfigurer corsConfigurer()
    {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                  registry.addMapping("/**")
                    .allowedOrigins("http://localhost")
                    .allowedMethods("*");
            }
        };
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper =  new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE); //to map nested object

        mapper.addMappings(new PropertyMap<Storage, StorageComplexDto>() {
            @Override
            protected void configure() {
                skip(destination.getAlertsStats());
                skip(destination.getActiveFoodStats());
            }
        });

        return mapper;
    }

}
