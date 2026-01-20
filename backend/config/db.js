const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("railway_db");
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
