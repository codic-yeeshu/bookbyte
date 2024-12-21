const userRouter = require("express").Router();
const { getUserInfo, updateAddress } = require("../controllers/user");
const { authenticateToken } = require("../middlewares/userAuth");

// middleware
userRouter.use(authenticateToken);

// get user Information
userRouter.get("/get-user-information", getUserInfo);

// update address
userRouter.put("/update-address", updateAddress);

module.exports = { userRouter };
