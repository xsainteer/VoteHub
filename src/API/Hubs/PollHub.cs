using Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class PollHub : Hub
{
    private readonly ICacheService _cacheService;

    public PollHub(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public async Task JoinPoll(Guid pollId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, pollId.ToString());
        
        await Clients.Group(pollId.ToString()).SendAsync("PollJoined", pollId);
    }
    
    public async Task LeavePoll(Guid pollId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, pollId.ToString());
    }
    
    public async Task SubmitVote(Guid pollId, Guid optionId)
    {
        await Clients.Group(pollId.ToString())
            .SendAsync("ReceiveVoteUpdate", optionId);
    }
}