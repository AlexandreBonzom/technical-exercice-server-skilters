const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const activitySectors = require("../Configuration/activity_sectors");

const userSchema = new Schema({
  private: {},
  public: {
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, type: String },
    telephone: { required: true, type: String, minlength: 10, maxlength: 10 },
    activitySectors: { type: String, enum: activitySectors, required: true },
    availableDate: { type: Date },
    status: {
      type: String,
      default: "Invalid",
      enum: ["Invalid", "Valid", "Active"]
    },
    token: { type: String, minlength: 26, maxlength: 26 }
  },
  private: {
    hash: { type: String },
    salt: { type: String, minlength: 26, maxlength: 26 }
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
