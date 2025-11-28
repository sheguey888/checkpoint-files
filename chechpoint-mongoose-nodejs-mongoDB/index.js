import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.js";

import {
  createAndSavePerson,
  createManyPeople,
} from "./controllers/createController.js";
import {
  findPeopleByName,
  findOneByFood,
  findPersonById,
  queryChain,
} from "./controllers/searchController.js";
import {
  findEditThenSave,
  findAndUpdate,
} from "./controllers/updateController.js";
import {
  removeById,
  removeManyPeople,
} from "./controllers/deleteController.js";

import Person from "./models/Person.js";
import { arrayOfPeople } from "./utils/testData.js";

// Initialize database connection
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
  } catch (error) {
    console.error("❌ Application initialization failed:", error);
    process.exit(1);
  }
};

export {
  // Model
  Person,

  // Create operations
  createAndSavePerson,
  createManyPeople,

  // Search operations
  findPeopleByName,
  findOneByFood,
  findPersonById,
  queryChain,

  // Update operations
  findEditThenSave,
  findAndUpdate,

  // Delete operations
  removeById,
  removeManyPeople,

  // Test data
  arrayOfPeople,
};

// Start application
initializeApp();
