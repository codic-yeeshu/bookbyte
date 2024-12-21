const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwt_secret = process.env.JWT_SECRET;

const signUp = async (req, res) => {
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
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = {
          name: existingUser.username,
          role: existingUser.role,
        };

        const token = jwt.sign(authClaims, jwt_secret, {
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
};

module.exports = { signIn, signUp };
