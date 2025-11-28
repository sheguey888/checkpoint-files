const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Remove whitespace from beginning and end
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    // User's age - optional field with validation
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },

    // User's phone number - optional
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },

    // User's address - optional
    address: {
      type: String,
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: function (doc, ret) {
        // Convert _id to id and remove __v for cleaner API responses
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.isNew) {
    console.log(`Creating new user: ${this.name}`);
  }
  next();
});

userSchema.methods.getFullInfo = function () {
  return `${this.name} (${this.email}) - Age: ${this.age || "Not specified"}`;
};

userSchema.statics.findByAgeRange = function (minAge, maxAge) {
  return this.find({
    age: { $gte: minAge, $lte: maxAge },
  });
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
