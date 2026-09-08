package com.speakup.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.speakup.dto.VoucherValidationResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.param.SubscriptionUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;


@Service
public class StripeService {

    @Value("${stripe.price-id}")
    private String priceId;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${stripe.coupon-id}")
    private String couponId;

    private final VoucherService voucherService;

    public StripeService(VoucherService voucherService) {
        this.voucherService = voucherService;
    }



    public String createCheckoutSession(

        String userId,
 
        String voucherCode) throws StripeException {
                SessionCreateParams.Builder builder = SessionCreateParams.builder()
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
                .putMetadata("planId", "6a8bd67360bf3bab41d1c72b");

                if (voucherCode != null && !voucherCode.trim().isEmpty()) {
                        String normalizedCode = voucherCode.trim().toUpperCase();
                        VoucherValidationResponse validation =        
                        voucherService.validateVoucher(normalizedCode);

                        if (!validation.isValid()) {       
                                throw new IllegalArgumentException(
        
                                        validation.getMessage()
                                );
                        }        
                        builder.putMetadata("voucherCode", normalizedCode);

                        builder.addDiscount(
                                SessionCreateParams.Discount.builder()
                                .setCoupon(couponId)
                                .build()
                        );
                }    
                Session session = Session.create(builder.build());
    
                return session.getUrl();

        }


        public Subscription cancelSubscription(String subscriptionId) throws StripeException {
                Subscription subscription = Subscription.retrieve(subscriptionId);

                SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
                        .setCancelAtPeriodEnd(true)
                        .build();

                subscription = subscription.update(params);
                return subscription;
        }

        public Subscription reactivateSubscription(String subscriptionId) throws StripeException {
                Subscription subscription = Subscription.retrieve(subscriptionId);

                SubscriptionUpdateParams params = SubscriptionUpdateParams.builder()
                        .setCancelAtPeriodEnd(false)
                        .build();

                subscription = subscription.update(params);
                return subscription;
        }


}