import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";

const app = express();
const options = {
  origin: "*",
  credentials: true,
};

// middleware
app.use(cors(options));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Api
app.get("/api/v1/test", (req, res) => {
  res.send("Backend is live! 🎉");
});
app.use("/api/v1/users", userRoute);

export { app };
