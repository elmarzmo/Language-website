package com.speakup.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final MailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public EmailService(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String email, String resetToken){

        String resetLink = "https://voixaenglish.com/reset-password?token=" + resetToken;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@voixaenglish.com");
        message.setTo(email);
        message.setSubject("Password Reset Request");

        message.setText(
             "Hello,\n\n" +
                "We received a request to reset your Voixaenglish password.\n\n" +
                "Click the link below to reset your password:\n\n" +
                resetLink +
                "\n\n" +
                "This link will expire in 15 minutes.\n\n" +
                "If you did not request a password reset, you can safely ignore this email.\n\n" +
                "Voixa English Team"
        );
     
       
      logger.info("SENDING password reset email");

try {
    mailSender.send(message);        
    logger.info("Password reset email sent successfully");
} catch (Exception e) {
    logger.error("Failed to send email: " + e);
    throw new RuntimeException("Failed to send email: " + e);
}

    }
    
}
