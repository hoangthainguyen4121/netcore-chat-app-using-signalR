using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatApp
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task JoinChatRoom(string user)
        {
            await Clients.All.SendAsync("UserJoined", user);
        }

        public async Task LeaveChatRoom(string user)
        {
            await Clients.All.SendAsync("UserLeft", user);
        }
    }
}
