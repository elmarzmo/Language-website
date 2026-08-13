package com.speakup.service;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final MailSender mailSender;

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
                "We received a request to reset your SpeakUp Languages password.\n\n" +
                "Click the link below to reset your password:\n\n" +
                resetLink +
                "\n\n" +
                "This link will expire in 15 minutes.\n\n" +
                "If you did not request a password reset, you can safely ignore this email.\n\n" +
                "Voixa English Team"
        );
     
       

  
        mailSender.send(message);

    

    }
    
}
