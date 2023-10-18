const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^\S+@\S+\.\S+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: {
      type: String,
      required: [true, "required"],
      minlength: [8, "week password"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    },
    places: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
  },
  {
    timestamps: true,
  }
);

// Add a method to validate the password
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
