using System.Net;
using System.Net.Mail;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Email;

public class SmtpEmailSender : IEmailSender<VoteHubUser>
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<SmtpSettings> options, ILogger<SmtpEmailSender> logger)
    {
        _settings = options.Value;
        _logger = logger;
    }

    public async Task SendConfirmationLinkAsync(VoteHubUser user, string email, string confirmationLink)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new ArgumentException("User email cannot be null or empty", nameof(user));
            }
            
            using var smtpClient = new SmtpClient(_settings.Host); 
            smtpClient.Port = _settings.Port;
            smtpClient.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.Timeout = 10000;

            using var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_settings.From);
            mailMessage.Subject = "Confirm your VoteHub account";
            mailMessage.Body = $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.";
            mailMessage.IsBodyHtml = true;
            mailMessage.Priority = MailPriority.High;

            mailMessage.To.Add(user.Email);
            
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, "SMTP error occurred while sending confirmation email to {Email}", user.Email);
            throw new InvalidOperationException("Failed to send confirmation email", ex);
        }
    }

    public async Task SendPasswordResetLinkAsync(VoteHubUser user, string email, string resetLink)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new ArgumentException("User email cannot be null or empty", nameof(user));
            }
            
            using var smtpClient = new SmtpClient(_settings.Host); 
            smtpClient.Port = _settings.Port;
            smtpClient.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.Timeout = 10000;

            using var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_settings.From);
            mailMessage.Subject = "Reset your VoteHub password";
            mailMessage.Body = $"Please reset your VoteHub password by <a href='{resetLink}'>clicking here</a>.";
            mailMessage.IsBodyHtml = true;
            mailMessage.Priority = MailPriority.High;

            mailMessage.To.Add(user.Email);
            
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, "SMTP error occurred while sending password resetting link email to {Email}", user.Email);
            throw new InvalidOperationException("Failed to send password resetting link email", ex);
        }
    }

    public async Task SendPasswordResetCodeAsync(VoteHubUser user, string email, string resetCode)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                throw new ArgumentException("User email cannot be null or empty", nameof(user));
            }
            
            using var smtpClient = new SmtpClient(_settings.Host); 
            smtpClient.Port = _settings.Port;
            smtpClient.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtpClient.Timeout = 10000;

            using var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_settings.From);
            mailMessage.Subject = "VoteHub password reset code";
            mailMessage.Body = $"Reset password code: <span>{resetCode}</span>.";
            mailMessage.IsBodyHtml = true;
            mailMessage.Priority = MailPriority.High;

            mailMessage.To.Add(user.Email);
            
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (SmtpException ex)
        {
            _logger.LogError(ex, "SMTP error occurred while sending password resetting code email to {Email}", user.Email);
            throw new InvalidOperationException("Failed to send password resetting code email", ex);
        }
    }
}