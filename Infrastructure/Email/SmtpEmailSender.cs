using System.Net;
using System.Net.Mail;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Email;

public class SmtpEmailSender : IEmailSender<VoteHubUser>
{
    private readonly IConfiguration _config;

    public SmtpEmailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendConfirmationLinkAsync(VoteHubUser user, string email, string confirmationLink)
    {
        if (string.IsNullOrWhiteSpace(user.Email))
        {
            throw new ArgumentException("User email cannot be null or empty", nameof(user));
        }

        var smtpHost = _config["Smtp:Host"] ?? 
                       throw new InvalidOperationException("SMTP host configuration is missing");
    
        var smtpPort = int.Parse(_config["Smtp:Port"] ?? 
                                 throw new InvalidOperationException("SMTP port configuration is missing"));
    
        var smtpUsername = _config["Smtp:Username"] ?? 
                           throw new InvalidOperationException("SMTP username configuration is missing");
    
        var smtpPassword = _config["Smtp:Password"] ?? 
                           throw new InvalidOperationException("SMTP password configuration is missing");
    
        var fromAddress = _config["Smtp:From"] ?? 
                          throw new InvalidOperationException("SMTP from address configuration is missing");

        using var smtpClient = new SmtpClient(smtpHost);
        smtpClient.Port = smtpPort;
        smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
        smtpClient.EnableSsl = true;
        smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
        smtpClient.Timeout = 10000;

        using var mailMessage = new MailMessage();
        mailMessage.From = new MailAddress(fromAddress);
        mailMessage.Subject = "Confirm your VoteHub account";
        mailMessage.Body = $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.";
        mailMessage.IsBodyHtml = true;
        mailMessage.Priority = MailPriority.High;

        mailMessage.To.Add(user.Email);

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (SmtpException ex)
        {
            // Log the error here
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