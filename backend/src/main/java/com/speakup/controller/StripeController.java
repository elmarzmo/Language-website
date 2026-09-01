package com.speakup.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.speakup.service.StripeService;
import com.stripe.exception.StripeException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/student/stripe")
@PreAuthorize("hasRole('STUDENT')")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(
            HttpServletRequest httpRequest) {

        try {
            String studentId =
                    (String) httpRequest.getAttribute("userId");

            String checkoutUrl =
                    stripeService.createCheckoutSession(studentId);

            return ResponseEntity.ok(
                    Map.of("url", checkoutUrl)
            );

        } catch (StripeException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(Map.of(
                            "error",
                            "Unable to create Stripe checkout session."
                    ));
        }
    }
}