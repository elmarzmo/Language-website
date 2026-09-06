package com.speakup.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.service.EnrollmentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

@RestController
@RequestMapping("/api/stripe")
public class StripeWebhookController {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final EnrollmentService enrollmentService;

    public StripeWebhookController(
            EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {

        try {

            Event event = Webhook.constructEvent(
                    payload,
                    signature,
                    webhookSecret
            );

            System.out.println(
                    "Stripe event received: " + event.getType()
            );

            if ("checkout.session.completed"
                    .equals(event.getType())) {
Session session =
        (Session) event.getDataObjectDeserializer()
                .deserializeUnsafe();

System.out.println("Checkout session ID: " + session.getId());

                String userId =
                        session.getMetadata().get("userId");

                String planId =
                        session.getMetadata().get("planId");

                String voucherCode =
                        session.getMetadata().get("voucherCode");

                if (userId == null || planId == null) {

                    System.out.println("MISSING METADATA");

                    System.out.println("userId: " + userId);

                    System.out.println("planId: " + planId);

                    System.out.println("voucherCode: " + voucherCode);
                    return ResponseEntity.badRequest()
                            .body("Missing checkout metadata.");
                }

                enrollmentService.completeEnrollmentFromStripe(
                        userId,
                        planId,
                        voucherCode
                );

                System.out.println(
                        "Student enrollment completed for user: "
                                + userId
                );
            }

            return ResponseEntity.ok("Webhook received: " + event.getType());

        } catch (SignatureVerificationException e) {

            return ResponseEntity.badRequest()
                    .body("Invalid Stripe signature");

        } catch (Exception e) {

            System.out.println("WEBHOOK ERROR: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Webhook processing failed" + e.getMessage());
        }
    }
}
