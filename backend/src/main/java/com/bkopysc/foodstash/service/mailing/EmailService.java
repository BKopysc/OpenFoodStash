package com.bkopysc.foodstash.service.mailing;

import com.bkopysc.foodstash.domain.EmailDetails;

public interface EmailService {

    String sendUserActionMail(EmailDetails emailDetails);

    String sendShareOfferMail();
}
