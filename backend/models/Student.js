const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    photoUrl: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    mobile: { type: String },
    email: { type: String },
    homePhone: { type: String },
    dob: { type: Date },
    uniqueIdNumber: { type: String },
    companyName: { type: String },
    companyGST: { type: String },
    anniversary: { type: Date },
    vipMember: { type: Boolean, default: false },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    enrollmentFee: { type: Number, default: 0 },
    discountType: { type: String },
    discount: { type: Number, default: 0 },
    joinDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["live", "demo", "expired"], default: "live" },
    documents: [{ type: String }],
    remark: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);