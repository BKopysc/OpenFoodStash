package com.bkopysc.foodstash.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

//SET SMTP SETTINGS FOR PRODUCTION


@Configuration
public class JavaMailSenderConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		
		/*
        mailSender.setHost("example.com");
        mailSender.setPort(587);

        mailSender.setUsername("example@example.org");
        mailSender.setPassword("example");

        Properties properties = mailSender.getJavaMailProperties();

        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.debug", "true");
		
		*/

        return mailSender;
    }
}

