using System;

namespace IntelliBiz.Models
{
    public class Settings
    {
        public int Id { get; set; }
        public string SiteName { get; set; } = string.Empty;
        public string AdminEmail { get; set; } = string.Empty;
        public string SupportEmail { get; set; } = string.Empty;
        public string DefaultCurrency { get; set; } = string.Empty;
        public string TermsOfService { get; set; } = string.Empty;
        public string PrivacyPolicy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
} 