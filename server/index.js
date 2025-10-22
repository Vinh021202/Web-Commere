import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";

const app = express();
const PORT = process.env.PORT || 8000; // 🔹 khai báo ở đây

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// Routes
app.get("/", (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` });
});

// Kết nối DB và khởi động server
await connectDB();

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});