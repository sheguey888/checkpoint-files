class Contact {
  /**
   * Represents a contact with name and phone number
   */
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.prev = null;
    this.next = null;
  }

  toString() {
    return `${this.name} - ${this.phone}`;
  }
}

class ContactManager {
  /**
   * Contact management system using doubly linked list and hash table
   */
  constructor() {
    this.head = null; // First contact in the list
    this.tail = null; // Last contact in the list
    this.hashTable = {}; // Object for quick lookup by name
  }

  addContact(name, phone) {
    /**
     * Add a new contact to the system
     */
    const nameLower = name.toLowerCase();

    if (nameLower in this.hashTable) {
      // Update existing contact
      const existingContact = this.hashTable[nameLower];
      existingContact.phone = phone;
      console.log(`Contact '${name}' updated.`);
    } else {
      // Create new contact
      const newContact = new Contact(name, phone);

      // Add to hash table
      this.hashTable[nameLower] = newContact;

      // Add to doubly linked list (at the end)
      if (this.head === null) {
        // First contact
        this.head = newContact;
        this.tail = newContact;
      } else {
        // Add to the end
        this.tail.next = newContact;
        newContact.prev = this.tail;
        this.tail = newContact;
      }

      console.log("Contact added.");
    }
  }

  searchByKeyword(keyword) {
    /**
     * Search contacts by substring match (naive algorithm)
     */
    const keywordLower = keyword.toLowerCase();
    const matches = [];

    // Traverse the linked list
    let current = this.head;
    while (current) {
      // Naive substring search
      if (this._substringMatch(current.name.toLowerCase(), keywordLower)) {
        matches.push(current);
      }
      current = current.next;
    }

    return matches;
  }

  _substringMatch(text, pattern) {
    /**
     * Naive substring matching algorithm
     */
    if (pattern.length === 0) {
      return true;
    }
    if (pattern.length > text.length) {
      return false;
    }

    // Check each position in text
    for (let i = 0; i <= text.length - pattern.length; i++) {
      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    }
    return false;
  }

  searchByName(name) {
    /**
     * Search contact by exact name using hash table
     */
    const nameLower = name.toLowerCase();
    return this.hashTable[nameLower] || null;
  }

  displayForward() {
    /**
     * Display all contacts from first to last
     */
    if (this.head === null) {
      console.log("No contacts available.");
      return;
    }

    console.log("\n--- Contacts (Forward) ---");
    let current = this.head;
    while (current) {
      console.log(current.toString());
      current = current.next;
    }
    console.log();
  }

  displayBackward() {
    /**
     * Display all contacts from last to first
     */
    if (this.tail === null) {
      console.log("No contacts available.");
      return;
    }

    console.log("\n--- Contacts (Backward) ---");
    let current = this.tail;
    while (current) {
      console.log(current.toString());
      current = current.prev;
    }
    console.log();
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  /**
   * Main function to run the contact management system
   */
  const manager = new ContactManager();

  while (true) {
    console.log("\n=== Contact Management System ===");
    console.log("1. Add Contact");
    console.log("2. Search by Keyword");
    console.log("3. Search by Exact Name");
    console.log("4. View All (Forward)");
    console.log("5. View All (Backward)");
    console.log("6. Exit");

    const option = (await question("\nEnter option: ")).trim();

    if (option === "1") {
      const name = (await question("Name: ")).trim();
      const phone = (await question("Phone: ")).trim();
      if (name && phone) {
        manager.addContact(name, phone);
      } else {
        console.log("Name and phone cannot be empty.");
      }
    } else if (option === "2") {
      const keyword = (await question("Search keyword: ")).trim();
      if (keyword) {
        const matches = manager.searchByKeyword(keyword);
        if (matches.length > 0) {
          console.log(`\nFound ${matches.length} match(es):`);
          matches.forEach((contact) => {
            console.log(`Match found: ${contact.toString()}`);
          });
        } else {
          console.log("No matches found.");
        }
      } else {
        console.log("Keyword cannot be empty.");
      }
    } else if (option === "3") {
      const name = (await question("Enter exact name: ")).trim();
      if (name) {
        const contact = manager.searchByName(name);
        if (contact) {
          console.log(`\nContact found: ${contact.toString()}`);
        } else {
          console.log("Contact not found.");
        }
      } else {
        console.log("Name cannot be empty.");
      }
    } else if (option === "4") {
      manager.displayForward();
    } else if (option === "5") {
      manager.displayBackward();
    } else if (option === "6") {
      console.log("Goodbye!");
      rl.close();
      break;
    } else {
      console.log("Invalid option. Please try again.");
    }
  }
}

main();
