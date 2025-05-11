using System.Net;
using System.Net.Mail;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Email;

public class SmtpEmailSender : IEmailSender<VoteHubUser>
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(SmtpSettings settings, ILogger<SmtpEmailSender> logger)
    {
        _settings = settings;
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

    public Task SendPasswordResetLinkAsync(VoteHubUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCodeAsync(VoteHubUser user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }
}