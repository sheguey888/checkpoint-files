/**
 * Hello Command Handler
 *
 * Handles the /hello slash command with personalized greetings
 *
 * Usage:
 * - /hello             -> Greets the user by their Slack name
 * - /hello John        -> Greets "John" specifically
 * - /hello @username   -> Greets the mentioned user
 */

/**
 * Process the /hello command
 *
 * @param {Object} command - The command payload from Slack
 * @param {Function} ack - Function to acknowledge the command
 * @param {Function} say - Function to send a message
 * @param {Object} client - Slack Web API client
 */
async function handleHelloCommand({ command, ack, say, client }) {
  try {
    // Acknowledge the command immediately (must be done within 3 seconds)
    await ack();

    // Log the command execution
    console.log(
      `[/hello] User: ${command.user_id}, Channel: ${command.channel_id}, Text: "${command.text}"`
    );

    // Get user information
    const userInfo = await client.users.info({ user: command.user_id });
    const userName = userInfo.user.real_name || userInfo.user.name;

    // Parse command text
    const commandText = command.text.trim();

    // Prepare greeting message
    let greetingText;
    let greetingName;

    if (commandText) {
      // Check if text contains a user mention
      const userMentionMatch = commandText.match(/<@([A-Z0-9]+)>/);

      if (userMentionMatch) {
        // Extract user ID from mention
        const mentionedUserId = userMentionMatch[1];

        try {
          const mentionedUserInfo = await client.users.info({
            user: mentionedUserId,
          });
          greetingName =
            mentionedUserInfo.user.real_name || mentionedUserInfo.user.name;
        } catch (error) {
          console.error("Error fetching mentioned user info:", error);
          greetingName = commandText;
        }
      } else {
        // Use the provided text as the name
        greetingName = commandText;
      }

      greetingText = `Hello, *${greetingName}*! 👋`;
    } else {
      // Default greeting with the command user's name
      greetingName = userName;
      greetingText = `Hello, *${greetingName}*! 👋`;
    }

    // Send the response
    await say({
      response_type: "in_channel", // Make the response visible to everyone
      text: greetingText,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: greetingText,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `_Sent by <@${
                command.user_id
              }> • ${new Date().toLocaleTimeString()}_`,
            },
          ],
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error("[/hello] Error:", error);

    // Try to send an error message
    try {
      await say({
        response_type: "ephemeral", // Only visible to the user
        text: "❌ Sorry, I encountered an error processing your command. Please try again!",
      });
    } catch (sayError) {
      console.error("[/hello] Error sending error message:", sayError);
    }

    return { success: false, error };
  }
}

/**
 * Generate a random greeting message
 *
 * @param {string} name - The name to greet
 * @returns {string} A random greeting
 */
function getRandomGreeting(name) {
  const greetings = [
    `Hello, ${name}! 👋`,
    `Hi there, ${name}! 🌟`,
    `Greetings, ${name}! 🎉`,
    `Hey ${name}! 😊`,
    `Welcome, ${name}! 🚀`,
    `Good to see you, ${name}! 💫`,
    `Howdy, ${name}! 🤠`,
    `Salutations, ${name}! 🎩`,
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Advanced hello command with more features
 *
 * @param {Object} params - Command parameters
 * @returns {Object} Response object
 */
async function handleHelloCommandAdvanced({ command, ack, say, client }) {
  try {
    await ack();

    const userInfo = await client.users.info({ user: command.user_id });
    const userName = userInfo.user.real_name || userInfo.user.name;
    const commandText = command.text.trim();

    // Determine greeting type based on command text
    let responseBlocks = [];

    if (!commandText) {
      // Simple greeting
      responseBlocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: getRandomGreeting(userName),
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "_Try adding a name after /hello to greet someone specific!_\nExample: `/hello World` or `/hello @username`",
          },
        },
      ];
    } else {
      // Personalized greeting
      const greetingName = commandText;
      responseBlocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: getRandomGreeting(greetingName),
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
              text: `Greeting sent by <@${
                command.user_id
              }> at ${new Date().toLocaleString()}`,
            },
          ],
        },
      ];
    }

    await say({
      response_type: "in_channel",
      blocks: responseBlocks,
    });

    return { success: true };
  } catch (error) {
    console.error("[/hello] Advanced handler error:", error);
    await say("❌ Error processing command");
    return { success: false, error };
  }
}

module.exports = {
  handleHelloCommand,
  handleHelloCommandAdvanced,
  getRandomGreeting,
};
