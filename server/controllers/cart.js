const User = require("../models/user");

const addBookToCart = async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);

    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart)
      return res.status(200).json({ msg: "Book is already in Cart." });
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ msg: "Book added to Cart." });
  } catch (err) {
    console.error(
      `Error occurred in file: cart Controller, function: addBookToCart -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeBookFromCart = async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart)
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

    return res.status(200).json({ msg: "Book removed from Cart." });
  } catch (err) {
    console.error(
      `Error occurred in file: cart Controller, function: removeBookFromCart -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCartBooks = async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cartBooks = userData.cart.reverse();
    return res.status(200).json({
      status: "Success",
      data: cartBooks,
    });
  } catch (err) {
    console.error(
      `Error occurred in file: cart Controller, function: getCartBooks -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addBookToCart, removeBookFromCart, getCartBooks };
