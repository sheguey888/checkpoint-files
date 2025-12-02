require("dotenv").config();
const { App } = require("@slack/bolt");

// Initialize the Slack app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

// ============================================
// MESSAGE EVENT HANDLERS
// ============================================

// Listen to all messages in channels (for logging purposes)
app.message(async ({ message, say, client }) => {
  try {
    // Log the message
    console.log(
      `[MESSAGE LOG] Channel: ${message.channel}, User: ${message.user}, Text: ${message.text}`
    );

    // Don't respond to bot messages to avoid loops
    if (message.subtype === "bot_message") {
      return;
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
});

// Listen for app mentions (@BotName)
app.event("app_mention", async ({ event, say, client }) => {
  try {
    console.log(`[APP MENTION] User: ${event.user}, Text: ${event.text}`);

    const text = event.text.toLowerCase();

    // Parse the message to extract the command after the mention
    const mentionPattern = /<@[A-Z0-9]+>/;
    const cleanText = text.replace(mentionPattern, "").trim();

    // Handle different commands
    if (cleanText.includes("hello") || cleanText.includes("hi")) {
      await say({
        text: `Hello <@${event.user}>! 👋 How can I help you today?`,
        thread_ts: event.ts,
      });
    } else if (cleanText.includes("help")) {
      await say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*🤖 Bot Commands & Usage*\n\nHere's what I can do:",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Slash Commands:*\n• `/hello` - Greet the bot\n• `/hello [name]` - Greet with a personalized message",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Mention Commands:*\n• `@bot hello` - Say hello\n• `@bot help` - Show this help message\n• `@bot ping` - Test bot responsiveness\n• `@bot info` - Get bot information",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Direct Messages:*\n• Send me a DM and I'll respond!\n• I log all messages for event tracking",
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
                text: "_Built with ❤️ using Slack Bolt for Node.js_",
              },
            ],
          },
        ],
        thread_ts: event.ts,
      });
    } else if (cleanText.includes("ping")) {
      await say({
        text: `Pong! 🏓 I'm alive and responding! Response time: ${
          Date.now() - event.ts * 1000
        }ms`,
        thread_ts: event.ts,
      });
    } else if (cleanText.includes("info")) {
      const botInfo = await client.auth.test();
      await say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*🤖 Bot Information*\n\n*Bot Name:* ${botInfo.user}\n*User ID:* ${botInfo.user_id}\n*Team:* ${botInfo.team}\n*Status:* ✅ Online and operational`,
            },
          },
        ],
        thread_ts: event.ts,
      });
    } else {
      // Default response for unrecognized commands
      await say({
        text: `Hi <@${event.user}>! I received your message: "${cleanText}"\n\nI'm not sure how to respond to that. Try mentioning me with *help* to see what I can do! 🤔`,
        thread_ts: event.ts,
      });
    }
  } catch (error) {
    console.error("Error handling app mention:", error);
    await say({
      text: `Sorry <@${event.user}>, I encountered an error processing your request. Please try again! 🙏`,
      thread_ts: event.ts,
    });
  }
});

// Listen for direct messages
app.event("message", async ({ event, say }) => {
  try {
    // Only handle direct messages (channel type is 'im')
    if (event.channel_type === "im" && !event.subtype) {
      console.log(`[DIRECT MESSAGE] User: ${event.user}, Text: ${event.text}`);

      const text = event.text.toLowerCase();

      if (text.includes("hello") || text.includes("hi")) {
        await say(
          `Hello! 👋 Thanks for messaging me directly. How can I assist you today?`
        );
      } else if (text.includes("help")) {
        await say({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: '*🤖 Available Commands*\n\nYou can:\n• Say "hello" or "hi" to greet me\n• Ask for "help" to see this message\n• Say "ping" to test my response\n• Use `/hello` command in any channel\n• Mention me with @bot in channels',
              },
            },
          ],
        });
      } else if (text.includes("ping")) {
        await say(`Pong! 🏓 I'm here and ready to help!`);
      } else {
        await say(
          `I received your message: "${event.text}"\n\nI'm a simple bot, but I'm learning! Try saying "help" to see what I can do. 🤖`
        );
      }
    }
  } catch (error) {
    console.error("Error handling DM:", error);
  }
});

// ============================================
// SLASH COMMANDS
// ============================================

// Handle /hello command
app.command("/hello", async ({ command, ack, say, client }) => {
  try {
    // Acknowledge command request
    await ack();

    console.log(
      `[COMMAND] /hello executed by ${command.user_id}, text: "${command.text}"`
    );

    // Get user info to personalize the greeting
    const userInfo = await client.users.info({ user: command.user_id });
    const userName = userInfo.user.real_name || userInfo.user.name;

    // Parse command text for custom name
    const customName = command.text.trim();

    if (customName) {
      // Greet with custom name
      await say({
        response_type: "in_channel",
        text: `Hello, ${customName}! 👋`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Hello, *${customName}*! 👋\n\nGreetings from <@${command.user_id}>!`,
            },
          },
        ],
      });
    } else {
      // Default greeting
      await say({
        response_type: "in_channel",
        text: `Hello, ${userName}! 👋`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Hello, *${userName}*! 👋\n\nWelcome! I'm here to help. Try mentioning me with *@bot help* to see what I can do!`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "📖 Get Help",
                },
                action_id: "button_help",
                style: "primary",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "🏓 Ping",
                },
                action_id: "button_ping",
              },
            ],
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error handling /hello command:", error);
    await say(
      "Sorry, I encountered an error processing your command. Please try again! 🙏"
    );
  }
});

// ============================================
// INTERACTIVE COMPONENTS
// ============================================

// Handle button clicks
app.action("button_help", async ({ body, ack, say }) => {
  await ack();

  await say({
    text: "Help information",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🤖 Bot Commands & Usage*\n\nHere's what I can do:\n\n*Slash Commands:*\n• `/hello` - Greet the bot\n• `/hello [name]` - Personalized greeting\n\n*Mention Commands:*\n• `@bot hello` - Say hello\n• `@bot help` - Show help\n• `@bot ping` - Test response\n• `@bot info` - Bot information\n\n*Direct Messages:*\n• Send me a DM anytime!",
        },
      },
    ],
  });
});

app.action("button_ping", async ({ body, ack, say }) => {
  await ack();

  await say({
    text: `Pong! 🏓 Bot is operational!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Pong!* 🏓\n\n✅ Bot is online and operational\n⚡ Response: Instant\n🕐 Timestamp: ${new Date().toLocaleString()}`,
        },
      },
    ],
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
app.error(async (error) => {
  console.error("❌ Global error:", error);
});

// ============================================
// START THE APP
// ============================================

(async () => {
  try {
    await app.start();

    console.log("⚡️ Slack bot is running!");
    console.log(`📡 Socket Mode: Enabled`);
    console.log(`🤖 Bot is ready to receive events and commands`);
    console.log("=".repeat(50));
    console.log("Available commands:");
    console.log("  • /hello - Greet the bot");
    console.log("  • @bot help - Get help");
    console.log("  • @bot ping - Test response");
    console.log("  • Send DM - Direct message support");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Failed to start the bot:", error);
    process.exit(1);
  }
})();

// Handle process termination gracefully
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await app.stop();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await app.stop();
  process.exit(0);
});
