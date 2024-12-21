const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
require("./config/dbConn");

const PORT = process.env.PORT || 1000;

const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/user");
const { bookRouter } = require("./routes/book");
const { favouriteRouter } = require("./routes/favourite");
const { cartRouter } = require("./routes/cart");
const { orderRouter } = require("./routes/order");

app.get("/", (req, res) => {
  res.send("Hello from BookByte server...");
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
