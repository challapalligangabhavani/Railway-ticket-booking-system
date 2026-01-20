const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// ✅ BOOK TICKET
const bookTicket = async (req, res) => {
  try {
    const db = getDB();
    const bookings = db.collection("bookings");
    const trains = db.collection("trains");

    const { userId, trainId, seatsBooked } = req.body;

    if (!userId || !trainId || !seatsBooked) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const train = await trains.findOne({ _id: new ObjectId(trainId) });

    if (!train) {
      return res.status(404).json({ message: "Train not found" });
    }

    if (train.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    await trains.updateOne(
      { _id: new ObjectId(trainId) },
      { $inc: { availableSeats: -Number(seatsBooked) } }
    );

    const booking = {
      userId: new ObjectId(userId),
      trainId: new ObjectId(trainId),
      seatsBooked: Number(seatsBooked),
      bookingDate: new Date()
    };

    await bookings.insertOne(booking);

    res.status(201).json({
      message: "Ticket booked successfully",
      booking
    });
  } catch (err) {
    console.error("BOOK TICKET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER BOOKINGS
const getUserBookings = async (req, res) => {
  try {
    const db = getDB();
    const bookings = db.collection("bookings");

    const { userId } = req.params;

    const result = await bookings.find({
      userId: new ObjectId(userId)
    }).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CANCEL TICKET
const cancelTicket = async (req, res) => {
  try {
    const db = getDB();
    const bookings = db.collection("bookings");
    const trains = db.collection("trains");

    const { bookingId } = req.params;

    const booking = await bookings.findOne({
      _id: new ObjectId(bookingId)
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await trains.updateOne(
      { _id: booking.trainId },
      { $inc: { availableSeats: booking.seatsBooked } }
    );

    await bookings.deleteOne({
      _id: new ObjectId(bookingId)
    });

    res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (err) {
    console.error("CANCEL TICKET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ VERY IMPORTANT EXPORT
module.exports = {
  bookTicket,
  getUserBookings,
  cancelTicket
};
