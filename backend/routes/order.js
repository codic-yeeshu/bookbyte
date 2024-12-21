const { Router } = require("express");

const orderRouter = Router();

// middlewares
const { authenticateToken } = require("../middlewares/userAuth");

// controller functions
const {
  placeOrder,
  getAllOrders,
  updateStatus,
  getOrderHistory,
} = require("../controllers/order");

orderRouter.use(authenticateToken);

orderRouter.post("/place-order", placeOrder);
// get order history --user
orderRouter.get("/get-order-history", getOrderHistory);

// get all order history --admin
orderRouter.get("/get-all-orders", getAllOrders);
orderRouter.put("/update-status/:id", updateStatus);

module.exports = { orderRouter };
