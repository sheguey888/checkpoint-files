// Fonction récursive pour tester si un mot est un palindrome
function isPalindrome(word) {
  const originalWord = word;

  const cleanWord = word.replace(/\s+/g, "").toLowerCase();

  // Fonction récursive auxiliaire
  function checkPalindrome(str) {
    if (str.length <= 1) {
      return true;
    }

    if (str[0] !== str[str.length - 1]) {
      return false;
    }

    return checkPalindrome(str.slice(1, -1));
  }

  // Vérifier si c'est un palindrome
  const result = checkPalindrome(cleanWord);

  // Créer le message
  const message = result
    ? `"${originalWord}" est un palindrome`
    : `"${originalWord}" n'est pas un palindrome`;

  console.log(message);

  return message;
}

// Exemples d'utilisation
isPalindrome("gag"); // "gag" est un palindrome
isPalindrome("kayak"); // "kayak" est un palindrome
isPalindrome("php"); // "php" est un palindrome
isPalindrome("radar"); // "radar" est un palindrome
isPalindrome("hello"); // "hello" n'est pas un palindrome
isPalindrome("Kayak"); // "Kayak" est un palindrome
isPalindrome("A man a plan a canal Panama"); // "A man a plan a canal Panama" est un palindrome
