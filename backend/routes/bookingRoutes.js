const express = require("express");
const router = express.Router();

const {
  bookTicket,
  getUserBookings,
  cancelTicket
} = require("../controllers/bookingController");

router.post("/book", bookTicket);
router.get("/user/:userId", getUserBookings);
router.delete("/cancel/:bookingId", cancelTicket);

module.exports = router;
