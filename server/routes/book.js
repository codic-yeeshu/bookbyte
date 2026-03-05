const bookRouter = require("express").Router();
const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getRecentBooks,
  getBookById,
} = require("../controllers/book");
const { authenticateToken } = require("../middlewares/userAuth");

// add book --admin
bookRouter.post("/add-book", authenticateToken, addBook);

// update book --admin
bookRouter.put("/update-book", authenticateToken, updateBook);

// delete book --admin
bookRouter.delete("/delete-book", authenticateToken, deleteBook);

// get all books
bookRouter.get("/get-all-books", getAllBooks);

// get recently added books limit to 4
bookRouter.get("/get-recent-books", getRecentBooks);

// get book by id
bookRouter.get("/get-book-by-id/:bookid", getBookById);
module.exports = { bookRouter };
