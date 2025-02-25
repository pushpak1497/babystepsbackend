import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";

dotenv.config({ path: "./.env" });
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });
