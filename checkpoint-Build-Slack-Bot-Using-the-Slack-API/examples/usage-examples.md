# Usage Examples

This document provides practical examples of using the Slack bot and its various features.

## 📝 Table of Contents

1. [Basic Usage](#basic-usage)
2. [Slash Commands](#slash-commands)
3. [Mention Commands](#mention-commands)
4. [Direct Messages](#direct-messages)
5. [Advanced Examples](#advanced-examples)
6. [Integration Examples](#integration-examples)
7. [Utility Functions](#utility-functions)

---

## Basic Usage

### Starting the Bot

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### Expected Console Output

```
⚡️ Slack bot is running!
📡 Socket Mode: Enabled
🤖 Bot is ready to receive events and commands
==================================================
Available commands:
  • /hello - Greet the bot
  • @bot help - Get help
  • @bot ping - Test response
  • Send DM - Direct message support
==================================================
```

---

## Slash Commands

### `/hello` - Basic Greeting

**Input:**

```
/hello
```

**Bot Response:**

```
Hello, John Smith! 👋

Welcome! I'm here to help. Try mentioning me with @bot help to see what I can do!

[Get Help Button] [Ping Button]
```

### `/hello` with Custom Name

**Input:**

```
/hello World
```

**Bot Response:**

```
Hello, World! 👋

Sent by @john • 2:30 PM
```

### `/hello` with User Mention

**Input:**

```
/hello @jane
```

**Bot Response:**

```
Hello, Jane Doe! 👋

Sent by @john • 2:31 PM
```

---

## Mention Commands

### `@bot hello` - Greeting

**Input:**

```
@MyBot hello
```

**Bot Response:**

```
Hello @john! 👋 How can I help you today?
```

### `@bot help` - Get Help

**Input:**

```
@MyBot help
```

**Bot Response:**

```
🤖 Bot Help & Commands

Here's what I can do:

📝 Slash Commands
• /hello - Greet the bot (usage: /hello or /hello [name])

💬 Mention Commands
• @bot hello - Say hello
• @bot help - Show help
• @bot ping - Test response
• @bot info - Bot information

💌 Direct Messages
Send me a DM with: hello, help, ping, or any message!

📋 Features
✅ Message logging ✅ Event tracking ✅ Interactive buttons

💡 Tip: Try mentioning me with @bot hello in a channel!

Built with ❤️ using Slack Bolt for Node.js
```

### `@bot ping` - Test Response

**Input:**

```
@MyBot ping
```

**Bot Response:**

```
Pong! 🏓 I'm alive and responding! Response time: 42ms
```

### `@bot info` - Bot Information

**Input:**

```
@MyBot info
```

**Bot Response:**

```
🤖 Bot Information

Bot Name: MyBot
User ID: U123456789
Team: My Workspace
Status: ✅ Online and operational
```

### Unrecognized Command

**Input:**

```
@MyBot do something
```

**Bot Response:**

```
Hi @john! I received your message: "do something"

I'm not sure how to respond to that. Try mentioning me with help to see what I can do! 🤔
```

---

## Direct Messages

### Hello in DM

**Input (DM):**

```
hello
```

**Bot Response:**

```
Hello! 👋 Thanks for messaging me directly. How can I assist you today?
```

### Help in DM

**Input (DM):**

```
help
```

**Bot Response:**

```
🤖 Available Commands

You can:
• Say "hello" or "hi" to greet me
• Ask for "help" to see this message
• Say "ping" to test my response
• Use /hello command in any channel
• Mention me with @bot in channels
```

### Ping in DM

**Input (DM):**

```
ping
```

**Bot Response:**

```
Pong! 🏓 I'm here and ready to help!
```

### Custom Message in DM

**Input (DM):**

```
What's the weather like?
```

**Bot Response:**

```
I received your message: "What's the weather like?"

I'm a simple bot, but I'm learning! Try saying "help" to see what I can do. 🤖
```

---

## Advanced Examples

### Using Interactive Buttons

When you use `/hello`, the bot responds with interactive buttons:

**Click "Get Help" button:**

- Bot sends comprehensive help message

**Click "Ping" button:**

```
Pong! 🏓

✅ Bot is online and operational
⚡ Response: Instant
🕐 Timestamp: 12/15/2024, 2:45:30 PM
```

### Thread Replies

The bot responds to mentions in threads:

**In a thread:**

```
User: @MyBot hello
Bot: Hello @user! 👋 How can I help you today?
```

All responses to mentions are sent in the same thread to keep conversations organized.

---

## Integration Examples

### Using Command Handlers

```javascript
const { handleHelloCommand } = require("./commands/hello");

// In your bot.js
app.command("/hello", handleHelloCommand);
```

### Using Help Handler

```javascript
const { handleHelpRequest, getHelpBlocks } = require("./commands/help");

// Send help message
await handleHelpRequest({ say, userName: "John" });

// Or get help blocks for custom usage
const helpBlocks = getHelpBlocks("John");
await say({ blocks: helpBlocks });
```

### Using Logger

```javascript
const { createLogger } = require("./utils/logger");

// Create a logger with context
const logger = createLogger("MyFeature");

logger.info("Feature initialized");
logger.error("Something went wrong", new Error("Details"));
logger.command("/hello", { user: "U123", text: "World" });
logger.event("app_mention", { user: "U123", channel: "C123" });
```

### Using Message Parser

```javascript
const {
  extractUserMentions,
  parseCommand,
  stripSlackFormatting,
  isQuestion,
  containsKeyword,
} = require("./utils/messageParser");

// Extract user mentions
const mentions = extractUserMentions("Hello <@U123> and <@U456>");
// Returns: ['U123', 'U456']

// Parse command
const cmd = parseCommand("@bot hello world", "BOTID");
// Returns: { command: 'hello', args: ['world'], rawText: 'world' }

// Strip formatting
const clean = stripSlackFormatting("*bold* _italic_ `code`");
// Returns: 'bold italic code'

// Check if question
const isQ = isQuestion("What time is it?");
// Returns: true

// Check for keywords
const hasKeyword = containsKeyword("hello world", ["hello", "hi"]);
// Returns: true
```

---

## Utility Functions

### Random Greetings

```javascript
const { getRandomGreeting } = require("./commands/hello");

const greeting = getRandomGreeting("John");
// Returns one of: "Hello, John! 👋", "Hi there, John! 🌟", etc.
```

### Quick Help

```javascript
const { getQuickHelpBlocks } = require("./commands/help");

const quickHelp = getQuickHelpBlocks();
await say({ blocks: quickHelp });
```

### Command-Specific Help

```javascript
const { getCommandHelp } = require("./commands/help");

const helloHelp = getCommandHelp("hello");
console.log(helloHelp);
// Returns:
// {
//   name: '/hello',
//   description: 'Greet the bot or another user',
//   usage: '/hello [optional: name]',
//   examples: [...]
// }
```

### Text Truncation

```javascript
const { truncateText } = require("./utils/messageParser");

const short = truncateText("This is a very long message", 15);
// Returns: 'This is a ve...'
```

### Format Mentions

```javascript
const {
  formatUserMention,
  formatChannelMention,
} = require("./utils/messageParser");

const userMention = formatUserMention("U123456");
// Returns: '<@U123456>'

const channelMention = formatChannelMention("C123456");
// Returns: '<#C123456>'
```

---

## Event Logging Examples

### Console Logs

When the bot receives events, it logs them to the console:

**Message in Channel:**

```
[MESSAGE LOG] Channel: C123456, User: U123456, Text: Hello everyone!
```

**App Mention:**

```
[APP MENTION] User: U123456, Text: @bot help
```

**Direct Message:**

```
[DIRECT MESSAGE] User: U123456, Text: hello
```

**Command Execution:**

```
[/hello] User: U123456, Channel: C123456, Text: "World"
```

---

## Error Handling Examples

### Command Error

**If something goes wrong:**

**Input:**

```
/hello
```

**Bot Response (if error occurs):**

```
Sorry, I encountered an error processing your command. Please try again! 🙏
```

**Console Output:**

```
[2024-12-15T14:30:00.000Z] [ERROR] [/hello] Error: Connection timeout
Metadata: {
  "error": {
    "message": "Connection timeout",
    "stack": "..."
  }
}
```

### Graceful Degradation

If rich message blocks fail, the bot falls back to plain text:

**Rich Message (Preferred):**

```
[Formatted blocks with buttons and sections]
```

**Fallback (If blocks fail):**

```
🤖 Bot Help & Commands
...
[Plain text version]
```

---

## Testing Scenarios

### Test 1: Basic Functionality

```
1. /hello                    → Should greet you
2. @bot hello                → Should greet you
3. DM: hello                 → Should respond
4. @bot ping                 → Should respond "Pong!"
```

### Test 2: Help System

```
1. @bot help                 → Show full help
2. DM: help                  → Show DM help
3. Click "Get Help" button   → Show help message
```

### Test 3: Interactive Features

```
1. /hello                    → Shows buttons
2. Click "Get Help"          → Shows help
3. Click "Ping"              → Shows pong message
```

### Test 4: Error Recovery

```
1. @bot unknown-command      → Friendly error message
2. Invalid mention format    → Handles gracefully
3. Empty /hello              → Uses default greeting
```

---

## Integration Patterns

### Adding a New Command

```javascript
// 1. Create command handler in commands/mycommand.js
async function handleMyCommand({ command, ack, say, client }) {
  await ack();
  await say("Command executed!");
}

module.exports = { handleMyCommand };

// 2. Import and register in bot.js
const { handleMyCommand } = require("./commands/mycommand");
app.command("/mycommand", handleMyCommand);
```

### Adding Event Handler

```javascript
// Listen for reactions
app.event("reaction_added", async ({ event, client }) => {
  console.log(`Reaction: ${event.reaction} on message ${event.item.ts}`);
});
```

### Custom Middleware

```javascript
// Add logging middleware
app.use(async ({ next, context }) => {
  console.log("Request received:", context);
  await next();
});
```

---

## Best Practices

### 1. Always Acknowledge Commands

```javascript
app.command("/mycommand", async ({ command, ack, say }) => {
  // Acknowledge FIRST (within 3 seconds)
  await ack();

  // Then do work
  await say("Processing...");
});
```

### 2. Use Thread Replies for Context

```javascript
await say({
  text: "Response",
  thread_ts: event.ts, // Reply in thread
});
```

### 3. Provide Fallback Text

```javascript
await say({
  blocks: [...],
  text: 'Fallback text'  // For notifications
});
```

### 4. Handle Errors Gracefully

```javascript
try {
  await doSomething();
} catch (error) {
  console.error("Error:", error);
  await say("Sorry, something went wrong! 🙏");
}
```

### 5. Log Important Events

```javascript
const logger = createLogger("Feature");
logger.info("Operation started");
logger.error("Operation failed", error);
```

---

## Troubleshooting Examples

### Bot Not Responding

**Check:**

```javascript
// 1. Verify tokens are set
console.log("Bot token:", process.env.SLACK_BOT_TOKEN ? "Set" : "Missing");
console.log("App token:", process.env.SLACK_APP_TOKEN ? "Set" : "Missing");

// 2. Check Socket Mode connection
// Look for: "⚡️ Slack bot is running!" in console

// 3. Verify bot is in channel
// Invite: /invite @YourBot
```

### Events Not Received

**Debug:**

```javascript
// Add debug logging
app.message(async ({ message }) => {
  console.log("Message received:", message);
});

// Check Event Subscriptions in Slack app settings
// Verify: message.channels, message.im, app_mention
```

---

## Additional Resources

- See [README.md](../README.md) for setup instructions
- See [SLACK_SETUP.md](../SLACK_SETUP.md) for Slack app configuration
- See [bot.js](../bot.js) for complete bot implementation
- Visit [Slack API Docs](https://api.slack.com) for API reference

---

**Note:** These examples assume you have:

- ✅ Created a Slack app
- ✅ Configured OAuth permissions
- ✅ Enabled Socket Mode
- ✅ Set up environment variables
- ✅ Installed dependencies (`npm install`)
- ✅ Started the bot (`npm start`)

For setup instructions, see [SLACK_SETUP.md](../SLACK_SETUP.md).
