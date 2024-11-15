const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const jwt_secret = process.env.JWT_SECRET;
// Sign Up

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password's length should be greater than 5",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashPass, address });
    await newUser.save();
    return res.status(200).json({ message: "SignUp successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

// sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, jwt_secret, {
          expiresIn: "10d",
        });
        res.status(200).json({
          message: "Sign In successful",
          id: existingUser._id,
          role: existingUser.role,
          token,
        });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

// get user Information

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

// update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address });
    return res.status(200).json({ message: "Address Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
});
module.exports = router;
