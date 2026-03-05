const User = require("../models/user");

const addBookToFavourite = async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);

    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite)
      return res.status(200).json({ msg: "Book is already in Favourites." });
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ msg: "Book added to Favourites." });
  } catch (err) {
    console.error(
      `Error occurred in file: favourite Controller, function: addBookToFavourite -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeBookFromFavourite = async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite)
      await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    return res.status(200).json({ msg: "Book remove from Favourites." });
  } catch (err) {
    console.error(
      `Error occurred in file: favourite Controller, function: removeBookFromFavourite -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFavouriteBooks = async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourites");
    const favouriteBooks = userData.favourites;
    return res.status(200).json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (err) {
    console.error(
      `Error occurred in file: favourite Controller, function: getFavouriteBooks -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addBookToFavourite,
  removeBookFromFavourite,
  getFavouriteBooks,
};
