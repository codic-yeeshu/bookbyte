const Book = require("../models/book");
const User = require("../models/user");

const addBook = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(400)
        .json({ message: "You do not have access to add book" });
    const { url, title, author, price, desc, language } = req.body;

    const book = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
    });
    await book.save();

    res
      .status(200)
      .json({ bookId: book._id, message: "Book created Successfully..." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(400)
        .json({ message: "You do not have access to update book" });
    const bookId = req.headers["bookid"];
    const { url, title, author, price, desc, language } = req.body;

    // Find and update the book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { url, title, author, price, desc, language },
      { new: true } // Return the updated document
    );

    // Check if the book was found
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(400)
        .json({ message: "You do not have access to delete book" });
    const bookId = req.headers["bookid"];
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({ message: "Book deleted Successfully..." });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.json({ status: "Success", data: books });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const getRecentBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);

    res.json({ status: "Success", data: books });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const getBookById = async (req, res) => {
  try {
    const { bookid } = req.params;
    const book = await Book.findById(bookid);
    if (!book) return res.status(404).json({ message: "Book not found." });

    res.json({ status: "Success", data: book });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getRecentBooks,
  getBookById,
};
