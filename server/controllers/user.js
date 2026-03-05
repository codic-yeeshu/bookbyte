const user = require("../models/user");

const getUserInfo = async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await user.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await user.findByIdAndUpdate(id, { address });
    return res.status(200).json({ message: "Address Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = { updateAddress, getUserInfo };
