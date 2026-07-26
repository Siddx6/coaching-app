const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "operator"], required: true },
    mobile: { type: String },
    permissions: {
      students: { type: Boolean, default: true },
      batches: { type: Boolean, default: true },
      enquiries: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      expenses: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      masterSetup: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);