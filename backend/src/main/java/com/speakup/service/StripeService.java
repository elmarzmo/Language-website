package com.speakup.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class StripeService {

    @Value("${stripe.price-id}")
    private String priceId;

    @Value("${frontend.url}")
    private String frontendUrl;

    public String createCheckoutSession(String userId) throws StripeException {

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                        .setSuccessUrl(
                                frontendUrl + "/student/onboarding?payment=success"
                        )
                        .setCancelUrl(
                                frontendUrl + "/student/onboarding?payment=cancelled"
                        )
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setPrice(priceId)
                                        .setQuantity(1L)
                                        .build()
                        )
                        .putMetadata("userId", userId)
                        .build();

        Session session = Session.create(params);

        return session.getUrl();
    }
}