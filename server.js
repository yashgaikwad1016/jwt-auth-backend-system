import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/database.js";

console.log("MONGO URI:", process.env.MONGO_URI);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });