/**
 * Message Parser Utility
 *
 * Helpers for parsing and processing Slack messages
 */

/**
 * Extract user mentions from a message
 *
 * @param {string} text - Message text
 * @returns {Array<string>} Array of user IDs mentioned in the message
 */
function extractUserMentions(text) {
  if (!text) return [];

  const mentionPattern = /<@([A-Z0-9]+)>/g;
  const mentions = [];
  let match;

  while ((match = mentionPattern.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}

/**
 * Extract channel mentions from a message
 *
 * @param {string} text - Message text
 * @returns {Array<string>} Array of channel IDs mentioned in the message
 */
function extractChannelMentions(text) {
  if (!text) return [];

  const channelPattern = /<#([A-Z0-9]+)\|?([^>]*)>/g;
  const channels = [];
  let match;

  while ((match = channelPattern.exec(text)) !== null) {
    channels.push({
      id: match[1],
      name: match[2] || null,
    });
  }

  return channels;
}

/**
 * Extract URLs from a message
 *
 * @param {string} text - Message text
 * @returns {Array<string>} Array of URLs found in the message
 */
function extractUrls(text) {
  if (!text) return [];

  // Slack wraps URLs in <> brackets
  const slackUrlPattern = /<(https?:\/\/[^|>]+)(?:\|([^>]+))?>/g;
  const plainUrlPattern = /(?<!<)(https?:\/\/[^\s<>]+)(?!>)/g;

  const urls = [];
  let match;

  // Extract Slack-formatted URLs
  while ((match = slackUrlPattern.exec(text)) !== null) {
    urls.push({
      url: match[1],
      label: match[2] || match[1],
    });
  }

  // Extract plain URLs (not wrapped by Slack)
  while ((match = plainUrlPattern.exec(text)) !== null) {
    urls.push({
      url: match[1],
      label: match[1],
    });
  }

  return urls;
}

/**
 * Remove Slack formatting from text
 *
 * @param {string} text - Message text with Slack formatting
 * @returns {string} Plain text without Slack formatting
 */
function stripSlackFormatting(text) {
  if (!text) return "";

  let cleanText = text;

  // Remove user mentions (<@U123456>)
  cleanText = cleanText.replace(/<@[A-Z0-9]+>/g, "");

  // Remove channel mentions (<#C123456|channel-name>)
  cleanText = cleanText.replace(/<#[A-Z0-9]+\|?([^>]*)>/g, "$1");

  // Remove URLs but keep labels (<https://example.com|label>)
  cleanText = cleanText.replace(/<https?:\/\/[^|>]+\|([^>]+)>/g, "$1");
  cleanText = cleanText.replace(/<https?:\/\/[^>]+>/g, "");

  // Remove emphasis markers
  cleanText = cleanText.replace(/\*([^*]+)\*/g, "$1"); // Bold
  cleanText = cleanText.replace(/_([^_]+)_/g, "$1"); // Italic
  cleanText = cleanText.replace(/~([^~]+)~/g, "$1"); // Strikethrough
  cleanText = cleanText.replace(/`([^`]+)`/g, "$1"); // Code

  // Clean up extra whitespace
  cleanText = cleanText.replace(/\s+/g, " ").trim();

  return cleanText;
}

/**
 * Parse command from message text
 *
 * @param {string} text - Message text
 * @param {string} botUserId - Bot's user ID
 * @returns {Object} Parsed command object
 */
function parseCommand(text, botUserId) {
  if (!text) {
    return { command: null, args: [], rawText: "" };
  }

  // Remove bot mention if present
  const mentionPattern = new RegExp(`<@${botUserId}>`, "g");
  let cleanText = text.replace(mentionPattern, "").trim();

  // Split into words
  const words = cleanText.split(/\s+/);

  if (words.length === 0) {
    return { command: null, args: [], rawText: cleanText };
  }

  return {
    command: words[0].toLowerCase(),
    args: words.slice(1),
    rawText: words.slice(1).join(" "),
  };
}

/**
 * Check if message is a question
 *
 * @param {string} text - Message text
 * @returns {boolean} True if message appears to be a question
 */
function isQuestion(text) {
  if (!text) return false;

  const cleanText = stripSlackFormatting(text).trim();

  // Check for question mark
  if (cleanText.endsWith("?")) return true;

  // Check for question words at the start
  const questionWords = [
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "is",
    "are",
    "can",
    "could",
    "would",
    "should",
    "do",
    "does",
    "did",
  ];
  const firstWord = cleanText.split(/\s+/)[0].toLowerCase();

  return questionWords.includes(firstWord);
}

/**
 * Extract keywords from message
 *
 * @param {string} text - Message text
 * @param {Array<string>} stopWords - Words to ignore
 * @returns {Array<string>} Array of keywords
 */
function extractKeywords(text, stopWords = []) {
  if (!text) return [];

  const cleanText = stripSlackFormatting(text).toLowerCase();

  // Default stop words
  const defaultStopWords = [
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "will",
    "with",
    "you",
    "your",
  ];

  const allStopWords = [...defaultStopWords, ...stopWords];

  // Extract words (alphanumeric only)
  const words = cleanText.match(/\b[a-z0-9]+\b/g) || [];

  // Filter out stop words and short words
  const keywords = words.filter(
    (word) => word.length > 2 && !allStopWords.includes(word)
  );

  // Remove duplicates
  return [...new Set(keywords)];
}

/**
 * Truncate text to a maximum length
 *
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100, suffix = "...") {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Check if message mentions the bot
 *
 * @param {string} text - Message text
 * @param {string} botUserId - Bot's user ID
 * @returns {boolean} True if bot is mentioned
 */
function isBotMentioned(text, botUserId) {
  if (!text || !botUserId) return false;

  const mentionPattern = new RegExp(`<@${botUserId}>`, "i");
  return mentionPattern.test(text);
}

/**
 * Format user mention for Slack
 *
 * @param {string} userId - User ID to mention
 * @returns {string} Formatted mention string
 */
function formatUserMention(userId) {
  return `<@${userId}>`;
}

/**
 * Format channel mention for Slack
 *
 * @param {string} channelId - Channel ID to mention
 * @returns {string} Formatted channel mention
 */
function formatChannelMention(channelId) {
  return `<#${channelId}>`;
}

/**
 * Parse emoji from text
 *
 * @param {string} text - Message text
 * @returns {Array<string>} Array of emoji names found
 */
function extractEmojis(text) {
  if (!text) return [];

  const emojiPattern = /:([a-z0-9_+-]+):/g;
  const emojis = [];
  let match;

  while ((match = emojiPattern.exec(text)) !== null) {
    emojis.push(match[1]);
  }

  return emojis;
}

/**
 * Check if text contains specific keyword(s)
 *
 * @param {string} text - Message text
 * @param {string|Array<string>} keywords - Keyword(s) to search for
 * @param {boolean} caseSensitive - Whether search is case-sensitive
 * @returns {boolean} True if any keyword is found
 */
function containsKeyword(text, keywords, caseSensitive = false) {
  if (!text) return false;

  const searchText = caseSensitive ? text : text.toLowerCase();
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];

  return keywordArray.some((keyword) => {
    const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
    return searchText.includes(searchKeyword);
  });
}

module.exports = {
  extractUserMentions,
  extractChannelMentions,
  extractUrls,
  stripSlackFormatting,
  parseCommand,
  isQuestion,
  extractKeywords,
  truncateText,
  isBotMentioned,
  formatUserMention,
  formatChannelMention,
  extractEmojis,
  containsKeyword,
};
