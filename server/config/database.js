//what is mongoose?
// Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// It provides a straightforward, schema-based solution to model your application data.
const mongoose = require("mongoose");
require("dotenv").config();

// Database connection function
const connectDb = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connection established");
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
};

module.exports = { connectDb };
