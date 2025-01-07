using Microsoft.AspNetCore.Mvc;
using IntelliBiz.Models;
using IntelliBiz.Repositories;

namespace IntelliBiz.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(ChatRepository chatRepository) : ControllerBase
    {

        // GET: api/chat/{businessId}
        [HttpGet("{businessId}")]
        public async Task<IActionResult> GetAllChats(int businessId)
        {
            var chats = await chatRepository.GetAllChatsAsync(businessId);
            if (chats == null)
            {
                return NotFound("No chats found.");
            }

            return Ok(chats);
        }

        // GET: api/chat/{chatId}
        [HttpGet("{chatId}")]
        public async Task<IActionResult> GetChat(int chatId)
        {
            var chat = await chatRepository.ReadChatAsync(chatId);
            if (chat == null)
            {
                return NotFound("Chat not found.");
            }

            return Ok(chat);
        }

        // POST: api/chat
        [HttpPost]
        public async Task<IActionResult> CreateChat([FromBody] Chat chat)
        {
            if (chat == null)
            {
                return BadRequest("Chat data is required.");
            }

            var result = await chatRepository.CreateChatAsync(chat);

            if (result > 0)
            {
                return Ok("Chat created successfully.");
            }

            return StatusCode(500, "Error creating chat.");
        }

        // PUT: api/chat/{chatId}
        [HttpPut("{chatId}")]
        public async Task<IActionResult> UpdateChat(int chatId, [FromBody] Chat chat)
        {
            if (chat == null || chat.ChatId != chatId)
            {
                return BadRequest("Invalid chat data.");
            }

            var result = await chatRepository.UpdateChatAsync(chat);

            if (result > 0)
            {
                return Ok("Chat updated successfully.");
            }

            return StatusCode(500, "Error updating chat.");
        }

        // DELETE: api/chat/{chatId}
        [HttpDelete("{chatId}")]
        public async Task<IActionResult> DeleteChat(int chatId)
        {
            var result = await chatRepository.DeleteChatAsync(chatId);

            if (result > 0)
            {
                return Ok("Chat deleted successfully.");
            }

            return StatusCode(500, "Error deleting chat.");
        }
    }

}
