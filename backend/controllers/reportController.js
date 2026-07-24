const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

const getDashboard = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const todayJoining = await Student.countDocuments({ joinDate: { $gte: startOfToday } });
    const monthJoining = await Student.countDocuments({ joinDate: { $gte: startOfMonth } });
    const totalJoining = await Student.countDocuments();

    const liveStudents = await Student.countDocuments({ status: "live" });
    const demoStudents = await Student.countDocuments({ status: "demo" });
    const expiredStudents = await Student.countDocuments({ status: "expired" });

    const sumField = async (Model, field, dateFilter) => {
      const result = await Model.aggregate([
        { ...(dateFilter ? { $match: dateFilter } : { $match: {} }) },
        { $group: { _id: null, total: { $sum: `$${field}` } } },
      ]);
      return result[0]?.total || 0;
    };

    const todayCollection = await sumField(Payment, "paidAmount", { date: { $gte: startOfToday } });
    const monthCollection = await sumField(Payment, "paidAmount", { date: { $gte: startOfMonth } });
    const totalCollection = await sumField(Payment, "paidAmount");

    const todayExpense = await sumField(Expense, "amount", { date: { $gte: startOfToday } });
    const monthExpense = await sumField(Expense, "amount", { date: { $gte: startOfMonth } });
    const totalExpense = await sumField(Expense, "amount");

    res.json({
      joining: { today: todayJoining, month: monthJoining, total: totalJoining },
      collection: { today: todayCollection, month: monthCollection, total: totalCollection },
      expense: { today: todayExpense, month: monthExpense, total: totalExpense },
      students: { live: liveStudents, demo: demoStudents, expired: expiredStudents },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };