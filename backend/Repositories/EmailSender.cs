using System.Net;
using System.Net.Mail;

public class EmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string message)
    {
        var client = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential("raphasemaan@gmail.com", "foac oyjl lkme ueei")
        };

        return client.SendMailAsync(
            new MailMessage(from: "raphasemaan@gmail.com",
                            to: email,
                            subject,
                            message
                            ));
    }
}