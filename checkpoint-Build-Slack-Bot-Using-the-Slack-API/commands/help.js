/**
 * Help Command Handler
 *
 * Provides comprehensive help information about bot commands and features
 */

/**
 * Generate help message blocks
 *
 * @param {string} userName - The name of the user requesting help
 * @returns {Array} Array of Slack Block Kit blocks
 */
function getHelpBlocks(userName = null) {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🤖 Bot Help & Commands",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: userName
          ? `Hi *${userName}*! Here's what I can do for you:`
          : "Here's what I can do:",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📝 Slash Commands*",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "*Command:*\n`/hello`",
        },
        {
          type: "mrkdwn",
          text: "*Description:*\nGreet the bot",
        },
        {
          type: "mrkdwn",
          text: "*Usage:*\n`/hello` or `/hello [name]`",
        },
        {
          type: "mrkdwn",
          text: "*Example:*\n`/hello` or `/hello John`",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*💬 Mention Commands*\n\nMention me in a channel with these keywords:",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: "`@bot hello`",
        },
        {
          type: "mrkdwn",
          text: "Say hello to the bot",
        },
        {
          type: "mrkdwn",
          text: "`@bot help`",
        },
        {
          type: "mrkdwn",
          text: "Show this help message",
        },
        {
          type: "mrkdwn",
          text: "`@bot ping`",
        },
        {
          type: "mrkdwn",
          text: "Test bot responsiveness",
        },
        {
          type: "mrkdwn",
          text: "`@bot info`",
        },
        {
          type: "mrkdwn",
          text: "Get bot information",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*💌 Direct Messages*\n\nSend me a DM with any of these keywords:\n• `hello` or `hi` - Greeting\n• `help` - Show help\n• `ping` - Test response\n• Any other message - I'll respond!",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📋 Features*\n✅ Message logging\n✅ Event tracking\n✅ Interactive buttons\n✅ User mentions\n✅ Thread replies",
      },
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "💡 *Tip:* Try mentioning me with `@bot hello` in a channel!",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "_Built with ❤️ using Slack Bolt for Node.js_",
        },
      ],
    },
  ];

  return blocks;
}

/**
 * Generate a simple text-only help message
 *
 * @returns {string} Plain text help message
 */
function getHelpText() {
  return `🤖 *Bot Help & Commands*

📝 *Slash Commands:*
• /hello - Greet the bot (usage: /hello or /hello [name])

💬 *Mention Commands:*
• @bot hello - Say hello
• @bot help - Show help
• @bot ping - Test response
• @bot info - Bot information

💌 *Direct Messages:*
Send me a DM with: hello, help, ping, or any message!

📋 *Features:*
✅ Message logging ✅ Event tracking ✅ Interactive buttons

💡 Tip: Try mentioning me with @bot hello in a channel!`;
}

/**
 * Handle help command request
 *
 * @param {Object} params - Event parameters
 * @returns {Object} Help content
 */
async function handleHelpRequest({ say, userName = null }) {
  try {
    await say({
      blocks: getHelpBlocks(userName),
      text: getHelpText(), // Fallback text for notifications
    });

    return { success: true };
  } catch (error) {
    console.error("[Help] Error sending help message:", error);

    // Try sending a simple text version
    try {
      await say(getHelpText());
    } catch (fallbackError) {
      console.error("[Help] Fallback also failed:", fallbackError);
    }

    return { success: false, error };
  }
}

/**
 * Generate quick help message (shorter version)
 *
 * @returns {Array} Compact help blocks
 */
function getQuickHelpBlocks() {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*🤖 Quick Help*\n\n*Commands:* `/hello [name]`\n*Mentions:* `@bot hello/help/ping/info`\n*DMs:* Send me any message!\n\nMention me with `@bot help` for full details.",
      },
    },
  ];
}

/**
 * Generate command-specific help
 *
 * @param {string} commandName - Name of the command
 * @returns {Object} Command-specific help
 */
function getCommandHelp(commandName) {
  const commandHelp = {
    hello: {
      name: "/hello",
      description: "Greet the bot or another user",
      usage: "/hello [optional: name]",
      examples: [
        "/hello - Greets you by your Slack name",
        '/hello World - Greets "World"',
        "/hello @username - Greets the mentioned user",
      ],
    },
  };

  return commandHelp[commandName] || null;
}

module.exports = {
  getHelpBlocks,
  getHelpText,
  getQuickHelpBlocks,
  handleHelpRequest,
  getCommandHelp,
};
