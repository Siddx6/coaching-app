const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { category, amount, date, notes } = req.body;
    const expense = await Expense.create({ category, amount, date, notes });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addExpense, getExpenses };