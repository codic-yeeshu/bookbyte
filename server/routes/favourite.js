const { Router } = require("express");

const favouriteRouter = Router();

// middlewares
const { authenticateToken } = require("../middlewares/userAuth");

// controller functions
const {
  addBookToFavourite,
  removeBookFromFavourite,
  getFavouriteBooks,
} = require("../controllers/favourite");

favouriteRouter.use(authenticateToken);

favouriteRouter.put("/add-book-to-favourite", addBookToFavourite);
favouriteRouter.put("/remove-book-from-favourite", removeBookFromFavourite);
favouriteRouter.get("/get-favourite-books", getFavouriteBooks);

module.exports = { favouriteRouter };
