import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSliderRouter from "./route/homeSlider.route.js";
import bannerV1Router from "./route/bannerV1.route.js";
import blogRouter from "./route/blog.route.js";
import stripeRouter from "./route/stripe.route.js";
import orderRouter from "./route/order.route.js";
import chatRouter from "./route/chat.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.json({ message: `Server is running on port ${PORT}` });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeSlider", homeSliderRouter);
app.use("/api/bannerV1", bannerV1Router);
app.use("/api/blog", blogRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);

await connectDB();

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
