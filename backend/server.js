require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Habit = require("./habit.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/habits", async (req, res) => {
  try {
    const habit = await Habit.create({
      habit: req.body.habit,
      streak: 0,
      lastCompleted: null,
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/habits/:id", async (req, res) => {
  try {
    // 1. Find the habit
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // 2. Compute today and yesterday in "YYYY-MM-DD"
    const today = new Date().toLocaleDateString("en-CA");
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("en-CA");

    // 3. Apply the streak rules
    if (habit.lastCompleted === today) {
      return res.status(200).json({ alreadyDone: true, habit });
    } else if (habit.lastCompleted === yesterday) {
      habit.streak += 1; // continue the streak
    } else {
      habit.streak = 1; // gap → reset
    }

    habit.lastCompleted = today;

    // 4. Save it back to MongoDB
    await habit.save();

    res.json({ alreadyDone: false, habit });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid habit ID" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete("/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("error:", err.message);
    process.exit(1);
  });
