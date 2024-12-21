const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");

const placeOrder = async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // saving orders to user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderDataFromDb._id },
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Order placed Successfully.",
    });
  } catch (err) {
    console.error(
      `Error occurred in file: order controller, function: placeOrder -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const { id } = req.headers;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: {
        path: "book",
        model: "books",
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderData = [...userData.orders].reverse();

    return res.status(200).json({
      status: "Success",
      data: orderData,
    });
  } catch (err) {
    console.error(
      `Error occurred in file: order controller, function: getOrderHistory -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ message: "You are not authorised to get order details." });
    const orderData = await Order.find()
      //   .populate({
      //     path: "user",
      //   })
      .populate({
        path: "book",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: orderData,
    });
  } catch (err) {
    console.error(
      `Error occurred in file: order controller, function: getlAllOrders -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "You are not authorized to update Orders" });
    const { id } = req.params;
    const { status } = req.body;
    await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      status: "Success",
      message: "Status updated Successfully",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map((e) => e.message);

      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }
    console.error(
      `Error occurred in file: order controller, function: updateStatus -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { placeOrder, getOrderHistory, getAllOrders, updateStatus };
