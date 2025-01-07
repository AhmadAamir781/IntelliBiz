using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers
{
    using IntelliBiz.Models;
    using IntelliBiz.Repositories;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Threading.Tasks;

    [Route("api/[controller]")]
    [ApiController]
    public class MessageController(MessageRepository messageRepository) : ControllerBase
    {
        // GET: api/message/{chatId}
        [HttpGet("{chatId}")]
        public async Task<IActionResult> GetAllMessages(int chatId)
        {
            var messages = await messageRepository.GetAllMessagesAsync(chatId);
            if (messages == null)
            {
                return NotFound("No messages found.");
            }

            return Ok(messages);
        }

        // GET: api/message/{messageId}
        [HttpGet("{messageId}")]
        public async Task<IActionResult> GetMessage(int messageId)
        {
            var message = await messageRepository.ReadMessageAsync(messageId);
            if (message == null)
            {
                return NotFound("Message not found.");
            }

            return Ok(message);
        }

        // POST: api/message
        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] Message message)
        {
            if (message == null)
            {
                return BadRequest("Message data is required.");
            }

            var result = await messageRepository.CreateMessageAsync(message);

            if (result > 0)
            {
                return Ok("Message created successfully.");
            }

            return StatusCode(500, "Error creating message.");
        }

        // PUT: api/message/{messageId}
        [HttpPut("{messageId}")]
        public async Task<IActionResult> UpdateMessage(int messageId, [FromBody] Message message)
        {
            if (message == null || message.MessageId != messageId)
            {
                return BadRequest("Invalid message data.");
            }

            var result = await messageRepository.UpdateMessageAsync(message);

            if (result > 0)
            {
                return Ok("Message updated successfully.");
            }

            return StatusCode(500, "Error updating message.");
        }

        // DELETE: api/message/{messageId}
        [HttpDelete("{messageId}")]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var result = await messageRepository.DeleteMessageAsync(messageId);

            if (result > 0)
            {
                return Ok("Message deleted successfully.");
            }

            return StatusCode(500, "Error deleting message.");
        }
    }
}
