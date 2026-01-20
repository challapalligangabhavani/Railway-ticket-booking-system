import { useState } from "react";
import { searchTrains, bookTicket } from "../services/api";

function SearchTrains({ user }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [trains, setTrains] = useState([]);
  const [seats, setSeats] = useState({});
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setTrains([]);

    try {
      const res = await searchTrains(source, destination);
      if (!res.data || res.data.length === 0) {
        setMessage("No trains found");
      } else {
        setTrains(res.data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching trains");
    }
  };

  const handleBook = async (train) => {
    const seatsBooked = seats[train._id];

    const userId = user?._id || user?.id;

    console.log("BOOKING DATA =>", {
      userId,
      trainId: train._id,
      seatsBooked
    });

    if (!userId) {
      alert("Please login again");
      return;
    }

    if (!seatsBooked || Number(seatsBooked) <= 0) {
      alert("Enter valid seats");
      return;
    }

    if (Number(seatsBooked) > train.availableSeats) {
      alert("Not enough seats available");
      return;
    }

    try {
      const res = await bookTicket({
        userId,
        trainId: train._id,
        seatsBooked: Number(seatsBooked)
      });

      alert(res.data.message);

     
      setTrains((prev) =>
        prev.map((t) =>
          t._id === train._id
            ? {
                ...t,
                availableSeats:
                  t.availableSeats - Number(seatsBooked)
              }
            : t
        )
      );

      setSeats((prev) => ({ ...prev, [train._id]: "" }));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Booking failed (backend error)"
      );
    }
  };

  return (
    <div style={{ width: "700px", margin: "40px auto" }}>
      <h2>Search Trains</h2>

      {/* 🔍 SEARCH FORM */}
      <form onSubmit={handleSearch}>
        <input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />{" "}
        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />{" "}
        <button type="submit">Search</button>
      </form>

      <br />

      {message && <p>{message}</p>}

      {/* 🚆 TRAIN LIST */}
      {trains.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Train No</th>
              <th>Name</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Available Seats</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {trains.map((train) => (
              <tr key={train._id}>
                <td>{train.trainNumber}</td>
                <td>{train.trainName}</td>
                <td>{train.source}</td>
                <td>{train.destination}</td>
                <td>{train.availableSeats}</td>

                <td>
                  <input
                    type="number"
                    min="1"
                    max={train.availableSeats}
                    value={seats[train._id] || ""}
                    onChange={(e) =>
                      setSeats({
                        ...seats,
                        [train._id]: e.target.value
                      })
                    }
                    style={{ width: "60px" }}
                  />
                </td>

                <td>
                  <button onClick={() => handleBook(train)}>
                    Book
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

export default SearchTrains;
