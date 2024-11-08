using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBacked.Repositories;

public interface ITokenRepository
{
    string CreateJWTToken(IdentityUser user, List<string> roles);
}
