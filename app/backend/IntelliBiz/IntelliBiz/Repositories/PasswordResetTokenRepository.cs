using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using IntelliBiz.API.Models;

namespace IntelliBiz.API.Repositories
{
    public class PasswordResetTokenRepository : IPasswordResetTokenRepository
    {
        private static readonly ConcurrentDictionary<string, PasswordResetToken> _tokens = new();

        public Task AddAsync(PasswordResetToken token)
        {
            _tokens[token.Token] = token;
            return Task.CompletedTask;
        }

        public Task<PasswordResetToken?> GetByTokenAsync(string token)
        {
            _tokens.TryGetValue(token, out var result);
            return Task.FromResult(result);
        }

        public Task DeleteExpiredAsync()
        {
            var now = DateTime.UtcNow;
            var expired = _tokens.Where(kvp => kvp.Value.Expiration < now).Select(kvp => kvp.Key).ToList();
            foreach (var key in expired)
                _tokens.TryRemove(key, out _);
            return Task.CompletedTask;
        }
    }
} 