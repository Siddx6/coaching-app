const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
  try {
    const { memberId, password } = req.body;

    const student = await Student.findOne({ memberId }).populate("batch");
    if (!student || !student.password) {
      return res.status(400).json({ message: "Invalid member ID or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid member ID or password" });
    }

    const token = jwt.sign(
      { studentId: student._id, type: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const studentData = student.toObject();
    delete studentData.password;

    res.json({ token, student: studentData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.student.studentId);

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { studentLogin, changeStudentPassword };