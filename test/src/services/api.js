import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

/* ===============================
   🔧 GLOBAL ERROR HANDLING
   (helps debugging & stability)
================================ */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

/* ===============================
   👤 USER APIs
================================ */
export const registerUser = (data) =>
  API.post("/users/register", data);

export const loginUser = (data) =>
  API.post("/users/login", data);

/* ===============================
   🚆 TRAIN APIs
================================ */
export const getAllTrains = () =>
  API.get("/trains");

export const searchTrains = (source, destination) =>
  API.get(
    `/trains/search?source=${encodeURIComponent(
      source
    )}&destination=${encodeURIComponent(destination)}`
  );

/* ===============================
   🎟️ BOOKING APIs
================================ */
export const bookTicket = (data) =>
  API.post("/bookings/book", data);

export const getUserBookings = (userId) =>
  API.get(`/bookings/user/${userId}`);

export const cancelTicket = (bookingId) =>
  API.delete(`/bookings/cancel/${bookingId}`);
