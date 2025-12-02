# Slack App Setup Guide

This guide walks you through creating and configuring a Slack app for your bot from scratch.

## 📋 Prerequisites

- A Slack workspace where you have permission to install apps
- Access to https://api.slack.com/apps

## 🚀 Step-by-Step Setup

### Step 1: Create a New Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Fill in the details:
   - **App Name**: Choose a name for your bot (e.g., "My Awesome Bot")
   - **Workspace**: Select the workspace where you want to develop the app
5. Click **"Create App"**

### Step 2: Enable Socket Mode

Socket Mode allows your bot to receive events without exposing a public HTTP endpoint.

1. In your app's settings, go to **"Socket Mode"** (in the left sidebar)
2. Toggle **"Enable Socket Mode"** to **ON**
3. You'll be prompted to create an app-level token:
   - **Token Name**: Give it a descriptive name (e.g., "Socket Mode Token")
   - **Scopes**: Select `connections:write`
4. Click **"Generate"**
5. **Important**: Copy the token (starts with `xapp-`) and save it as `SLACK_APP_TOKEN` in your `.env` file
6. Click **"Done"**

### Step 3: Configure OAuth & Permissions

1. In the left sidebar, go to **"OAuth & Permissions"**
2. Scroll down to **"Scopes"** section
3. Under **"Bot Token Scopes"**, click **"Add an OAuth Scope"** and add the following:

   **Required Scopes:**

   - `chat:write` - Send messages as the bot
   - `channels:history` - View messages in public channels
   - `channels:read` - View basic channel information
   - `commands` - Add and use slash commands
   - `im:history` - View messages in direct messages
   - `im:read` - View basic information about direct messages
   - `im:write` - Start direct messages with users
   - `app_mentions:read` - View messages that directly mention the bot

   **Optional but Recommended:**

   - `users:read` - View user information (for personalization)
   - `chat:write.public` - Send messages to channels without joining
   - `groups:history` - View messages in private channels (if needed)

4. Scroll back up to **"OAuth Tokens for Your Workspace"**
5. Click **"Install to Workspace"**
6. Review the permissions and click **"Allow"**
7. **Important**: Copy the **"Bot User OAuth Token"** (starts with `xoxb-`) and save it as `SLACK_BOT_TOKEN` in your `.env` file

### Step 4: Get Your Signing Secret

1. In the left sidebar, go to **"Basic Information"**
2. Scroll down to **"App Credentials"**
3. Find **"Signing Secret"**
4. Click **"Show"** to reveal it
5. **Important**: Copy the signing secret and save it as `SLACK_SIGNING_SECRET` in your `.env` file

### Step 5: Enable Event Subscriptions

1. In the left sidebar, go to **"Event Subscriptions"**
2. Toggle **"Enable Events"** to **ON**
3. Under **"Subscribe to bot events"**, click **"Add Bot User Event"** and add:
   - `message.channels` - Messages posted to public channels
   - `message.im` - Messages sent in direct messages
   - `app_mention` - When someone mentions your bot with @
4. Click **"Save Changes"** at the bottom

### Step 6: Create Slash Commands

1. In the left sidebar, go to **"Slash Commands"**
2. Click **"Create New Command"**
3. Fill in the command details:

   **For /hello command:**

   - **Command**: `/hello`
   - **Request URL**: Leave blank (Socket Mode handles this)
   - **Short Description**: `Greet the bot`
   - **Usage Hint**: `[optional name]`

4. Click **"Save"**

5. **(Optional)** Create additional commands by repeating steps 2-4 with different command names

### Step 7: Customize Your Bot (Optional)

1. Go to **"Basic Information"**
2. Under **"Display Information"**, you can customize:
   - **App name**: Your bot's display name
   - **Short description**: Brief description of what your bot does
   - **App icon**: Upload a custom icon/avatar for your bot
   - **Background color**: Choose a brand color
3. Click **"Save Changes"**

### Step 8: Verify Your Configuration

Your `.env` file should now look like this:

```env
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-YOUR-APP-TOKEN-HERE
PORT=3000
```

## ✅ Testing Your Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Your Bot

```bash
npm start
```

You should see:

```
⚡️ Slack bot is running!
📡 Socket Mode: Enabled
🤖 Bot is ready to receive events and commands
```

### 3. Test in Slack

#### Test Direct Message:

1. In your Slack workspace, find your bot in the Apps section
2. Click on it to open a DM
3. Send "hello" - the bot should respond

#### Test Channel Mention:

1. Invite your bot to a channel: `/invite @YourBotName`
2. Mention it: `@YourBotName hello`
3. The bot should respond in the thread

#### Test Slash Command:

1. In any channel where the bot is present, type: `/hello`
2. Press Enter
3. The bot should respond with a greeting

## 🔧 Troubleshooting

### Bot Not Responding

**Problem**: Bot doesn't respond to messages or commands

**Solutions**:

1. Check that all three tokens are correctly set in `.env`
2. Verify Socket Mode is enabled
3. Ensure the bot is invited to the channel (`/invite @YourBot`)
4. Check console for error messages

### Token Errors

**Problem**: `invalid_auth` or `not_authed` errors

**Solutions**:

1. Regenerate your Bot User OAuth Token:
   - Go to **OAuth & Permissions**
   - Click **"Revoke"** on the current token
   - Click **"Reinstall to Workspace"**
   - Copy the new token to `.env`
2. Make sure tokens don't have extra spaces or line breaks

### Missing Scopes Error

**Problem**: `missing_scope` error in console

**Solutions**:

1. Go to **OAuth & Permissions** in your Slack app settings
2. Add the missing scope mentioned in the error
3. Reinstall the app to your workspace
4. Restart your bot

### Events Not Received

**Problem**: Bot logs don't show incoming events

**Solutions**:

1. Verify **Event Subscriptions** are enabled
2. Check that you've subscribed to the correct bot events
3. Ensure Socket Mode is enabled with a valid app token
4. Restart your bot after making changes

### Slash Command Not Working

**Problem**: `/hello` command not recognized

**Solutions**:

1. Verify the command is created in **Slash Commands** settings
2. Command names are case-sensitive
3. For Socket Mode, Request URL can be blank
4. Reinstall the app if you just added the command
5. Wait a few minutes for Slack to propagate the changes

## 📚 Additional Configuration

### App Home Tab (Optional)

1. Go to **App Home** in your app settings
2. Enable **"Home Tab"**
3. Customize the home tab experience for users

### Interactive Components (Optional)

1. Go to **Interactivity & Shortcuts**
2. Toggle **"Interactivity"** to **ON**
3. Request URL can be blank for Socket Mode

### App Distribution (Optional)

To distribute your app to other workspaces:

1. Go to **Manage Distribution**
2. Complete the checklist
3. Activate Public Distribution

## 🔐 Security Best Practices

1. **Never commit** your `.env` file to version control
2. **Rotate tokens** regularly (every 3-6 months)
3. **Use environment variables** in production
4. **Limit scopes** to only what your bot needs
5. **Monitor logs** for suspicious activity
6. **Implement rate limiting** for production bots

## 🎓 Next Steps

- ✅ Customize bot responses in `bot.js`
- ✅ Add more slash commands
- ✅ Implement custom event handlers
- ✅ Add database integration for persistent data
- ✅ Deploy to a production server
- ✅ Set up monitoring and alerting

## 📖 References

- [Slack API Documentation](https://api.slack.com/)
- [Bolt for JavaScript](https://slack.dev/bolt-js/tutorial/getting-started)
- [Socket Mode Guide](https://api.slack.com/apis/connections/socket)
- [OAuth Scopes Reference](https://api.slack.com/scopes)
- [Events API](https://api.slack.com/apis/connections/events-api)

## 🆘 Need Help?

- Check the [Slack API Community](https://api.slack.com/community)
- Review [Common Slack API Errors](https://api.slack.com/methods)
- Search [Stack Overflow](https://stackoverflow.com/questions/tagged/slack-api)
- Consult the [Troubleshooting](#-troubleshooting) section above
