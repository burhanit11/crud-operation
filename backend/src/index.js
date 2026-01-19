import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/connectDB.js";
dotenv.config();

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is Running On Port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
