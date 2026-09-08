package com.speakup.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.speakup.dto.EnrollmentRequestDTO;
import com.speakup.dto.EnrollmentResponseDTO;
import com.speakup.model.StudentOnboarding;
import com.speakup.model.Subscription;
import com.speakup.model.SubscriptionPlan;
import com.speakup.model.Voucher;
import com.speakup.repository.StudentOnboardingRepository;
import com.speakup.repository.SubscriptionPlanRepository;
import com.speakup.repository.SubscriptionRepository;
import com.speakup.repository.VoucherRepository;
import com.stripe.exception.StripeException;



@Service
public class EnrollmentService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final VoucherRepository voucherRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final StudentOnboardingRepository studentOnboardingRepository;
    private final StripeService stripeService;

    public EnrollmentService(
            SubscriptionPlanRepository subscriptionPlanRepository,
            VoucherRepository voucherRepository,
            SubscriptionRepository subscriptionRepository,
            StudentOnboardingRepository studentOnboardingRepository,
            StripeService stripeService
        
        ) {

        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.voucherRepository = voucherRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.studentOnboardingRepository = studentOnboardingRepository;
        this.stripeService = stripeService;
    }

    public EnrollmentResponseDTO enroll(
            String userId,
            EnrollmentRequestDTO request) {

        // 1. Find active subscription plan
        SubscriptionPlan plan =
                subscriptionPlanRepository
                        .findByIdAndActiveTrue(request.getPlanId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Subscription plan not found or inactive."
                                ));

        // 2. Check whether student already has an active subscription
        subscriptionRepository
                .findByUserIdAndStatus(
                        userId,
                        Subscription.SubscriptionStatus.ACTIVE
                )
                .ifPresent(subscription -> {
                    throw new IllegalArgumentException(
                            "You already have an active subscription."
                    );
                });

        // 3. Calculate price
        BigDecimal amount = plan.getPrice();

        Voucher voucher = null;

        // 4. Apply voucher if provided
        if (request.getVoucherCode() != null &&
                !request.getVoucherCode().trim().isEmpty()) {

            String code =
                    request.getVoucherCode()
                            .trim()
                            .toUpperCase();

            voucher = voucherRepository
                    .findByCode(code)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Invalid voucher code."
                            ));

            validateVoucher(voucher);

            amount = amount.subtract(voucher.getDiscountAmount());

            // Never allow negative price
            if (amount.compareTo(BigDecimal.ZERO) < 0) {
                amount = BigDecimal.ZERO;
            }
        }

        // 5. Create subscription
        LocalDateTime startDate = LocalDateTime.now();

        LocalDateTime endDate =
                startDate.plusMonths(1);

        Subscription subscription = new Subscription();

        subscription.setUserId(userId);
        subscription.setPlanId(plan.getId());
        subscription.setVoucherId(
                voucher != null ? voucher.getId() : null
        );
        subscription.setAmount(amount);
        subscription.setCurrency(plan.getCurrency());
        subscription.setStatus(
                Subscription.SubscriptionStatus.ACTIVE
        );
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);

        Subscription saved =
                subscriptionRepository.save(subscription);

        // 6. Update onboarding
        StudentOnboarding onboarding =
                studentOnboardingRepository
                        .findByUserId(userId)
                        .orElseGet(() -> {
                            StudentOnboarding newOnboarding =
                                    new StudentOnboarding();

                            newOnboarding.setUserId(userId);

                            return newOnboarding;
                        });

        onboarding.setEnrolled(true);
        onboarding.setSubscriptionId(saved.getId());

        studentOnboardingRepository.save(onboarding);

        // 7. Mark voucher as used
        if (voucher != null) {
            voucher.setUsedCount(
                    voucher.getUsedCount() + 1
            );

            voucherRepository.save(voucher);
        }

        return new EnrollmentResponseDTO(
                saved.getId(),
                saved.getPlanId(),
                saved.getAmount(),
                saved.getCurrency(),
                saved.getStatus(),
                saved.getStartDate(),
                saved.getEndDate(),
                voucher != null
        );
    }


    
    private void validateVoucher(Voucher voucher) {

        if (!voucher.isActive()) {
            throw new IllegalArgumentException(
                    "This voucher is no longer active."
            );
        }

        if (voucher.getExpirationDate() != null &&
                voucher.getExpirationDate()
                        .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "This voucher has expired."
            );
        }

        if (voucher.getMaxUses() > 0 &&
                voucher.getUsedCount() >= voucher.getMaxUses()) {

            throw new IllegalArgumentException(
                    "This voucher has reached its usage limit."
            );
        }
    }




    
public void completeEnrollmentFromStripe(
        String userId,
        String planId,
        String voucherCode,
        String stripeSubscriptionId
) {



        if (stripeSubscriptionId == null ||
            stripeSubscriptionId.isBlank()) {

        throw new IllegalArgumentException(
                "Stripe subscription ID is missing."
        );
    }
    // 1. Make sure the student does not already have an active subscription
    if (subscriptionRepository
            .findByUserIdAndStatus(
                    userId,
                    Subscription.SubscriptionStatus.ACTIVE
            )
            .isPresent()) {

        // Stripe can send the same webhook more than once.
        // If enrollment was already completed, do nothing.
        return;
    }

    // 2. Find the subscription plan
    SubscriptionPlan plan =
            subscriptionPlanRepository
                    .findByIdAndActiveTrue(planId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Subscription plan not found or inactive."
                            )
                    );

    // 3. Find voucher if one was used
    Voucher voucher = null;

    if (voucherCode != null && !voucherCode.trim().isEmpty()) {

        String normalizedCode =
                voucherCode.trim().toUpperCase();

        voucher = voucherRepository
                .findByCode(normalizedCode)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Voucher code not found."
                        )
                );

        validateVoucher(voucher);
    }

    // 4. Calculate the amount for the current billing period
    BigDecimal amount = plan.getPrice();

    if (voucher != null) {

        amount = amount.subtract(
                voucher.getDiscountAmount()
        );

        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            amount = BigDecimal.ZERO;
        }
    }

    // 5. Create the local subscription
    LocalDateTime startDate =
            LocalDateTime.now();

    LocalDateTime endDate =
            startDate.plusMonths(1);

    Subscription subscription =
            new Subscription();

    subscription.setUserId(userId);
    subscription.setPlanId(plan.getId());

    subscription.setVoucherId(
            voucher != null
                    ? voucher.getId()
                    : null
    );

    subscription.setAmount(amount);
    subscription.setCurrency(plan.getCurrency());

    subscription.setStatus(
            Subscription.SubscriptionStatus.ACTIVE
    );
    subscription.setStripeSubscriptionId(stripeSubscriptionId);

    subscription.setStartDate(startDate);
    subscription.setEndDate(endDate);

    Subscription saved =
            subscriptionRepository.save(subscription);

    // 6. Mark the student as enrolled
    StudentOnboarding onboarding =
            studentOnboardingRepository
                    .findByUserId(userId)
                    .orElseGet(() -> {

                        StudentOnboarding newOnboarding =
                                new StudentOnboarding();

                        newOnboarding.setUserId(userId);

                        return newOnboarding;
                    });

    onboarding.setEnrolled(true);
    onboarding.setSubscriptionId(saved.getId());

    if (voucher != null) {
        onboarding.setVoucherCode(
                voucher.getCode()
        );
    }

    studentOnboardingRepository.save(onboarding);

    // 7. Consume the voucher only after Stripe confirms the checkout
    if (voucher != null) {

        voucher.setUsedCount(
                voucher.getUsedCount() + 1
        );

        voucherRepository.save(voucher);
    }
}

public void cancelSubscription(String userId)
        throws StripeException {

    StudentOnboarding onboarding =
            studentOnboardingRepository
                    .findByUserId(userId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Student onboarding record not found."
                            )
                    );

    if (onboarding.getSubscriptionId() == null ||
            onboarding.getSubscriptionId().isBlank()) {

        throw new IllegalArgumentException(
                "No subscription found."
        );
    }

    Subscription subscription =
            subscriptionRepository
                    .findById(onboarding.getSubscriptionId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Subscription not found."
                            )
                    );

    if (subscription.getStripeSubscriptionId() == null ||
            subscription.getStripeSubscriptionId().isBlank()) {

        throw new IllegalArgumentException(
                "Stripe subscription ID is missing."
        );
    }

    if (subscription.getStatus() !=
            Subscription.SubscriptionStatus.ACTIVE) {

        throw new IllegalArgumentException(
                "Your subscription is not active."
        );
    }

    stripeService.cancelSubscription(
            subscription.getStripeSubscriptionId()
    );
}


public void reactivateSubscription(String userId)
        throws StripeException {

    StudentOnboarding onboarding =
            studentOnboardingRepository
                    .findByUserId(userId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Student onboarding record not found."
                            )
                    );

    if (onboarding.getSubscriptionId() == null ||
            onboarding.getSubscriptionId().isBlank()) {

        throw new IllegalArgumentException(
                "No subscription found."
        );
    }

    Subscription subscription =
            subscriptionRepository
                    .findById(onboarding.getSubscriptionId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Subscription not found."
                            )
                    );

    if (subscription.getStripeSubscriptionId() == null ||
            subscription.getStripeSubscriptionId().isBlank()) {

        throw new IllegalArgumentException(
                "Stripe subscription ID is missing."
        );
    }

    if (subscription.getStatus() !=
            Subscription.SubscriptionStatus.ACTIVE) {

        throw new IllegalArgumentException(
                "Your subscription is no longer active."
        );
    }

    stripeService.reactivateSubscription(
            subscription.getStripeSubscriptionId()
    );
}

public void handleStripeSubscriptionUpdated(
        String stripeSubscriptionId,
        boolean cancelAtPeriodEnd
) {

    Subscription subscription =
            subscriptionRepository
                    .findByStripeSubscriptionId(stripeSubscriptionId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Subscription not found for Stripe subscription: "
                                            + stripeSubscriptionId
                            )
                    );



                    subscription.setCancelAtPeriodEnd(cancelAtPeriodEnd);

    
    // The subscription is still active even when
    // cancellation is scheduled.
    subscription.setStatus(
            Subscription.SubscriptionStatus.ACTIVE
    );

    subscriptionRepository.save(subscription);
}
public void handleStripeSubscriptionDeleted(
        String stripeSubscriptionId
) {

    Optional<Subscription> optionalSubscription =
            subscriptionRepository
                    .findByStripeSubscriptionId(stripeSubscriptionId);

    if (optionalSubscription.isEmpty()) {

        System.out.println(
                "No local subscription found for deleted Stripe subscription: "
                        + stripeSubscriptionId
        );

        return;
    }

    Subscription subscription = optionalSubscription.get();

    subscription.setCancelAtPeriodEnd(false);

    subscription.setStatus(
            Subscription.SubscriptionStatus.CANCELED
    );

    subscriptionRepository.save(subscription);

    studentOnboardingRepository
            .findByUserId(subscription.getUserId())
            .ifPresent(onboarding -> {
                onboarding.setEnrolled(false);
                studentOnboardingRepository.save(onboarding);
            });
}
}
