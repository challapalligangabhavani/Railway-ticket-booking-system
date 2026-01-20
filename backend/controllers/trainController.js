const { getDB } = require("../config/db");

// ✅ ADD TRAIN
const addTrain = async (req, res) => {
  try {
    const db = getDB();
    const trains = db.collection("trains");

    const { trainNumber, trainName, source, destination, totalSeats } = req.body;

    if (!trainNumber || !trainName || !source || !destination || !totalSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTrain = await trains.findOne({ trainNumber });

    if (existingTrain) {
      return res.status(400).json({ message: "Train already exists" });
    }

    const newTrain = {
      trainNumber,
      trainName,
      source,
      destination,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      createdAt: new Date()
    };

    await trains.insertOne(newTrain);

    res.status(201).json({ message: "Train added successfully" });
  } catch (err) {
    console.error("ADD TRAIN ERROR:", err);
    res.status(500).json({ message: "Error adding train" });
  }
};

// ✅ SEARCH TRAINS
const searchTrains = async (req, res) => {
  try {
    const db = getDB();
    const trains = db.collection("trains");

    const { source, destination } = req.query;

    const result = await trains.find({
      source,
      destination
    }).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error("SEARCH TRAIN ERROR:", err);
    res.status(500).json({ message: "Error fetching trains" });
  }
};

// ✅ GET ALL TRAINS
const getAllTrains = async (req, res) => {
  try {
    const db = getDB();
    const trains = db.collection("trains");

    const result = await trains.find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error("GET ALL TRAINS ERROR:", err);
    res.status(500).json({ message: "Error fetching trains" });
  }
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  addTrain,
  searchTrains,
  getAllTrains
};
