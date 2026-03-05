const { Router } = require("express");
const { signUp, signIn } = require("../controllers/auth");

const authRouter = Router();

// Sign Up
authRouter.post("/sign-up", signUp);

// sign in
authRouter.post("/sign-in", signIn);

module.exports = { authRouter };
