import { useEffect, useState } from "react";
import { getUserBookings, cancelTicket } from "../services/api";

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    if (!user || !user._id) return;

    try {
      const res = await getUserBookings(user._id);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
   
  }, []);


  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this ticket?"
    );
    if (!confirmCancel) return;

    try {
      const res = await cancelTicket(bookingId);
      alert(res.data.message);

      
      setBookings((prev) =>
        prev.filter((b) => b._id !== bookingId)
      );
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  return (
    <div style={{ width: "700px", margin: "40px auto" }}>
      <h2>My Bookings</h2>

      {message && <p>{message}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Train ID</th>
              <th>Seats Booked</th>
              <th>Booking Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.trainId}</td>
                <td>{booking.seatsBooked}</td>
                <td>
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
                <td>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyBookings;
