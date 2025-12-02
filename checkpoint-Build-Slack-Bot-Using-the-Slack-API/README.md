# Slack Bot Using Slack API

A comprehensive Slack bot built with Node.js and Slack Bolt that responds to messages, handles commands, and logs events.

## 🎯 Features

- ✅ Responds to messages in Slack channels
- ✅ Recognizes and handles custom commands (e.g., `/hello`)
- ✅ Logs messages using the Slack Events API
- ✅ Mentions and direct message handling
- ✅ Interactive buttons and actions
- ✅ User-friendly help command
- ✅ Error handling and logging

## 📋 Prerequisites

- Node.js 14.x or higher
- A Slack workspace where you have permission to install apps
- Basic understanding of JavaScript and Node.js

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd checkpoint-Build-Slack-Bot-Using-the-Slack-API
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Slack credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Slack app credentials:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
PORT=3000
```

### 3. Set Up Slack App

Follow the detailed instructions in [SLACK_SETUP.md](./SLACK_SETUP.md) to:

- Create a Slack app
- Configure OAuth permissions
- Enable Events API
- Install the app to your workspace

### 4. Run the Bot

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 📚 Bot Commands

| Command         | Description             | Example                   |
| --------------- | ----------------------- | ------------------------- |
| `/hello`        | Greet the bot           | `/hello` or `/hello John` |
| `@BotName help` | Show help message       | `@YourBot help`           |
| `@BotName ping` | Test bot responsiveness | `@YourBot ping`           |
| `@BotName info` | Get bot information     | `@YourBot info`           |

## 💬 Message Handling

The bot responds to:

- **Direct mentions**: `@BotName your message`
- **Direct messages**: Send a DM to the bot
- **Keywords**: Messages containing specific keywords (configurable)
- **Channel messages**: All messages in subscribed channels (logged only)

## 🏗️ Project Structure

```
checkpoint-Build-Slack-Bot-Using-the-Slack-API/
├── bot.js                      # Main bot application
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── SLACK_SETUP.md             # Detailed Slack app setup guide
├── commands/
│   ├── hello.js               # Hello command handler
│   └── help.js                # Help command handler
├── utils/
│   ├── logger.js              # Custom logging utility
│   └── messageParser.js       # Message parsing helpers
└── examples/
    └── usage-examples.md      # Usage examples and patterns
```

## 🔧 Configuration

### Environment Variables

| Variable               | Required | Description                                             |
| ---------------------- | -------- | ------------------------------------------------------- |
| `SLACK_BOT_TOKEN`      | Yes      | Bot User OAuth Token (starts with `xoxb-`)              |
| `SLACK_SIGNING_SECRET` | Yes      | Signing secret for request verification                 |
| `SLACK_APP_TOKEN`      | Yes      | App-level token for Socket Mode (starts with `xapp-`)   |
| `PORT`                 | No       | Server port (default: 3000)                             |
| `LOG_LEVEL`            | No       | Logging level: debug, info, warn, error (default: info) |

### Bot Permissions Required

- `chat:write` - Send messages
- `channels:history` - View messages in public channels
- `channels:read` - View basic channel information
- `commands` - Add slash commands
- `im:history` - View messages in DMs
- `im:read` - View basic DM information
- `im:write` - Send DMs

### Event Subscriptions

Subscribe to these events:

- `message.channels` - Messages in public channels
- `message.im` - Direct messages
- `app_mention` - When bot is mentioned

## 🧪 Testing

### Test the Bot

1. **Test ping response**:

   ```
   @YourBot ping
   ```

2. **Test hello command**:

   ```
   /hello
   /hello World
   ```

3. **Test help command**:

   ```
   @YourBot help
   ```

4. **Send a direct message**:
   - Open a DM with the bot
   - Send any message

### Verify Logs

Check the console output to verify:

- Bot is receiving events
- Messages are being logged
- Commands are executing properly

## 📖 Usage Examples

### Basic Interaction

```
User: @MyBot hello
Bot: Hello! 👋 How can I help you today?

User: @MyBot ping
Bot: Pong! 🏓 I'm alive and responding!

User: /hello Alice
Bot: Hello, Alice! 👋
```

### Getting Help

```
User: @MyBot help
Bot: [Displays comprehensive help message with available commands]
```

### Error Handling

The bot gracefully handles:

- Invalid commands
- Missing permissions
- Network errors
- Rate limiting

## 🚢 Deployment

### Local Development

```bash
npm run dev
```

### Production Deployment

#### Option 1: Traditional Server

```bash
npm install --production
npm start
```

#### Option 2: Docker

```bash
docker build -t slack-bot .
docker run -d --env-file .env slack-bot
```

#### Option 3: Cloud Platforms

- **Heroku**: See [Heroku deployment guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- **AWS Lambda**: Use [Serverless Bolt](https://slack.dev/bolt-js/deployments/aws-lambda)
- **Google Cloud Run**: See [Cloud Run documentation](https://cloud.google.com/run/docs)

### Using Socket Mode vs HTTP

**Socket Mode** (Current implementation):

- ✅ No public URL required
- ✅ Works behind firewalls
- ✅ Easier for development
- ⚠️ Requires app-level token

**HTTP Mode** (Alternative):

- ✅ More scalable
- ✅ Works with serverless
- ⚠️ Requires public URL
- ⚠️ Need to handle request verification

## 🔍 Troubleshooting

### Bot not responding

1. **Check tokens**: Ensure all tokens in `.env` are correct
2. **Verify permissions**: Check OAuth scopes in Slack app settings
3. **Check event subscriptions**: Ensure events are properly configured
4. **Review logs**: Check console output for errors

### Events not being received

1. **Verify Socket Mode**: Ensure Socket Mode is enabled
2. **Check app token**: App-level token should start with `xapp-`
3. **Event subscriptions**: Verify events are subscribed in Slack app settings

### Commands not working

1. **Slash command setup**: Ensure commands are configured in Slack app
2. **Request URL**: For HTTP mode, verify the request URL is correct
3. **Permissions**: Check bot has necessary permissions

### Common Errors

| Error               | Solution                                |
| ------------------- | --------------------------------------- |
| `not_authed`        | Check your bot token                    |
| `missing_scope`     | Add required OAuth scopes               |
| `channel_not_found` | Bot needs to be invited to channel      |
| `invalid_auth`      | Regenerate tokens in Slack app settings |

## 📚 Additional Resources

- [Slack API Documentation](https://api.slack.com)
- [Bolt for JavaScript Guide](https://slack.dev/bolt-js/tutorial/getting-started)
- [Events API Documentation](https://api.slack.com/apis/connections/events-api)
- [Slack App Management](https://api.slack.com/apps)
- [Block Kit Builder](https://app.slack.com/block-kit-builder) - Design rich messages

## 🤝 Contributing

Feel free to enhance the bot with:

- Additional commands
- More sophisticated message parsing
- Database integration
- External API integrations
- Custom workflows

## 📝 License

This project is created for educational purposes as part of the Slack API exercise.

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Slack API [error codes](https://api.slack.com/methods)
3. Check the [Slack Community](https://api.slack.com/community)

## 🎓 Learning Objectives Achieved

✅ Authentication with Slack API using OAuth tokens  
✅ Event handling with Slack Events API  
✅ Command recognition and processing  
✅ Message logging and event tracking  
✅ Error handling and debugging  
✅ Best practices for Slack bot development

## 🔐 Security Notes

- Never commit `.env` file to version control
- Rotate tokens regularly
- Use environment variables for all sensitive data
- Implement rate limiting for production use
- Validate all user inputs
