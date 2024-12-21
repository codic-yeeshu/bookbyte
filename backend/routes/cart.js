const { Router } = require("express");

const cartRouter = Router();

// middlewares
const { authenticateToken } = require("../middlewares/userAuth");

// controller functions
const {
  addBookToCart,
  removeBookFromCart,
  getCartBooks,
} = require("../controllers/cart");

cartRouter.use(authenticateToken);

cartRouter.put("/add-book-to-cart", addBookToCart);
cartRouter.put("/remove-book-from-cart", removeBookFromCart);
cartRouter.get("/get-user-cart", getCartBooks);

module.exports = { cartRouter };
