const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    courseInterest: { type: String },
    source: { type: String },
    status: {
      type: String,
      enum: ["new", "followup", "converted", "closed"],
      default: "new",
    },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);