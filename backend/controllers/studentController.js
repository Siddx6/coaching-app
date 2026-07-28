const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const Payment = require("../models/Payment");
    const body = { ...req.body };

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    let photoUrl = "";
    let documents = [];

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        photoUrl = req.files.photo[0].path;
      }
      if (req.files.documents) {
        documents = req.files.documents.map((doc) => doc.path);
      }
    }

    const student = await Student.create({
      ...body,
      photoUrl,
      documents,
    });

    const enrollmentFee = Number(body.enrollmentFee) || 0;
    if (enrollmentFee > 0) {
      await Payment.create({
        student: student._id,
        totalFee: enrollmentFee,
        paidAmount: 0,
        dueAmount: enrollmentFee,
        mode: "enrollment",
        receiptNo: "ENROLL-" + student.memberId,
      });
    }

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("batch").sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const body = { ...req.body };
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    } else {
      delete body.password;
    }
    const student = await Student.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStudent, getStudents, deleteStudent, updateStudentStatus, updateStudent };