const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
require("./config/dbConn");

const PORT = process.env.PORT;

const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/user");
const { bookRouter } = require("./routes/book");
const { favouriteRouter } = require("./routes/favourite");
const { cartRouter } = require("./routes/cart");
const { orderRouter } = require("./routes/order");

app.get("/", (req, res) => {
  console.log("ping fired")
  res.send("Hello from BookByte server...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.listen(PORT, () => {
  console.log(`SERVER IS UP ON PORT ${PORT}`, `http://localhost:${PORT}`);
});

module.exports = app;
