const express = require("express");
const router = express.Router();

const {
  addTrain,
  searchTrains,
  getAllTrains
} = require("../controllers/trainController");

// ADMIN
router.post("/add", addTrain);

// USER
router.get("/search", searchTrains);
router.get("/", getAllTrains);

module.exports = router;
