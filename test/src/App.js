import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SearchTrains from "./pages/SearchTrains";
import MyBookings from "./pages/MyBookings"; // ✅ IMPORTANT

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        🚆 Railway Ticket Booking System
      </h1>

      {!user ? (
        <>
          <Register />
          <Login onLogin={setUser} />
        </>
      ) : (
        <>
          <h3 style={{ textAlign: "center" }}>
            Welcome, {user.name} 🎉
          </h3>

          {/* 🔍 BOOK TRAIN */}
          <SearchTrains user={user} />

          <hr />

          {/* 🎟️ MY BOOKINGS → CANCEL BUTTON IS HERE */}
          <MyBookings user={user} />
        </>
      )}
    </div>
  );
}

export default App;
