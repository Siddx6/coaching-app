const mongoose = require("mongoose");

const enrollmentFeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnrollmentFee", enrollmentFeeSchema);