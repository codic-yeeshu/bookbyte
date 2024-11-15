const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
require("./connections/dbConn");

const PORT = process.env.PORT || 1000;

const User = require("./routes/user");
const Book = require("./routes/book");

app.get("/", (req, res) => {
  res.send("Hello from server...");
});

// routes

app.use("/api", User);
app.use("/api", Book);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
