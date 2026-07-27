require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./config/db");
const Student = require("./models/Student");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subCourseRoutes = require("./routes/subCourseRoutes");
const batchRoutes = require("./routes/batchRoutes");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const enrollmentFeeRoutes = require("./routes/enrollmentFeeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subcourses", subCourseRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/enrollment-fees", enrollmentFeeRoutes);

app.get("/", (req, res) => {
  res.send("Coaching App API is running");
});

// Runs once every day at midnight — checks for students whose endDate has passed
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await Student.updateMany(
      { endDate: { $lt: new Date() }, status: { $ne: "expired" } },
      { status: "expired" }
    );
    if (result.modifiedCount > 0) {
      console.log(`Marked ${result.modifiedCount} student(s) as expired`);
    }
  } catch (err) {
    console.error("Expiry check failed:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));