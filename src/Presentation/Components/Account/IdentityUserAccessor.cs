using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;

namespace Presentation.Components.Account;

internal sealed class IdentityUserAccessor(
    UserManager<VoteHubUser> userManager,
    IdentityRedirectManager redirectManager)
{
    public async Task<VoteHubUser> GetRequiredUserAsync(HttpContext context)
    {
        var user = await userManager.GetUserAsync(context.User);

        if (user is null)
        {
            redirectManager.RedirectToWithStatus("Account/InvalidUser",
                $"Error: Unable to load user with ID '{userManager.GetUserId(context.User)}'.", context);
        }

        return user;
    }
}