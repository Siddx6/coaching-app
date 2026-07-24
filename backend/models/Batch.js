const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    subCourse: { type: mongoose.Schema.Types.ObjectId, ref: "SubCourse", required: true },
    name: { type: String, required: true },
    startDate: { type: Date },
    monthlyFee: { type: Number, default: 0 },
    oneTimeFee: { type: Number, default: 0 },
    status: { type: String, enum: ["live", "ended"], default: "live" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);