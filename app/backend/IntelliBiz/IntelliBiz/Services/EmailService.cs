using System.Net;
using System.Net.Mail;

namespace IntelliBiz.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService(IConfiguration configuration) : IEmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpSection = configuration.GetSection("Smtp");
            var host = smtpSection["Host"];
            var port = int.Parse(smtpSection["Port"] ?? "587");
            var username = smtpSection["Username"];
            var password = smtpSection["Password"];
            var senderEmail = smtpSection["SenderEmail"];
            var enableSsl = bool.Parse(smtpSection["EnableSsl"] ?? "true");

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = enableSsl
            };

            var mail = new MailMessage(senderEmail, to, subject, body)
            {
                IsBodyHtml = false
            };

            await client.SendMailAsync(mail);
        }
    }
} 