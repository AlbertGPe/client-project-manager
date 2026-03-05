const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: "User name is required",
      minlength: [3, "User name needs at least 3 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: "User email is required",
      match: [/^\S+@\S+\.\S+$/, "User email must be valid"],
    },
    password: {
      type: String,
      required: "Student password is required",
      minlength: [8, "Student password needs at least 8 chars"],
      match: [/^(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must contain numbers and Mayus"]
    },
    confirm: { //TODO EMAIL CONFIRMATION EXPIRATION
      type: Boolean,
      default: true, //TODO PUT VALUE TO FALSE AT THE END OF THE PROJECT
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function () {
  const user = this;

  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      
      user.password = hash;
    } catch (error) {
      throw error;
    }
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
