package com.bkopysc.foodstash.service.mailing;

import com.bkopysc.foodstash.domain.EmailDetails;
import com.bkopysc.foodstash.domain.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired private JavaMailSender javaMailSender;

    @Value("${spring.mail.from}") private String sender;

    @Override
    @Async
    public String sendUserActionMail(EmailDetails emailDetails) {
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mailMessage = new MimeMessageHelper(mimeMessage, "utf-8");
            mailMessage.setFrom(sender);
            mailMessage.setTo(emailDetails.getRecipient());

            mailMessage.setText("<html><body>" +
                    emailDetails.getMsgBody() + emailDetails.getMsgFooter() +
                    "<small>"+sender+"</small>"
                    + "</body></html>", true);
            mailMessage.setSubject(emailDetails.getSubject());
            javaMailSender.send(mimeMessage);

            return "Email send successfully";
        } catch (Exception e){
            return "Error while sending email!";
        }
    }

    @Override
    public String sendShareOfferMail() {
        return null;
    }
}
