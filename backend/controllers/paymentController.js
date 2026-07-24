const Payment = require("../models/Payment");
const Student = require("../models/Student");

const addPayment = async (req, res) => {
  try {
    const { student, totalFee, paidAmount, mode, receiptNo } = req.body;

    const existingPayments = await Payment.find({ student });
    const alreadyPaid = existingPayments.reduce((sum, p) => sum + p.paidAmount, 0);

    const newPaidTotal = alreadyPaid + Number(paidAmount);
    const dueAmount = Number(totalFee) - newPaidTotal;

    const payment = await Payment.create({
      student,
      totalFee,
      paidAmount,
      dueAmount,
      mode,
      receiptNo,
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.studentId }).sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addPayment, getPaymentsByStudent };