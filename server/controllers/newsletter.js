const NewsletterSubscriber = require("../models/newsletterSubscriber");
const User = require("../models/user");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readEmail = (body) =>
  typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

const subscribe = async (req, res) => {
  try {
    const email = readEmail(req.body);
    if (!EMAIL_PATTERN.test(email))
      return res.status(400).json({ message: "Please enter a valid email." });

    // link the subscriber to an account with the same email, if there is one
    const account = await User.findOne({ email }).select("_id");

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        $set: { status: "subscribed", ...(account && { user: account._id }) },
      },
      { upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Subscribed to the Bookbyte Letter." });
  } catch (err) {
    // two requests for the same new email at once — the other one created it
    if (err.code === 11000)
      return res
        .status(200)
        .json({ message: "Subscribed to the Bookbyte Letter." });
    console.error(
      `Error occurred in file: newsletter controller, function: subscribe -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const email = readEmail(req.body);
    if (!EMAIL_PATTERN.test(email))
      return res.status(400).json({ message: "Please enter a valid email." });

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      { $set: { status: "unsubscribed" } }
    );

    // same answer whether or not the email was on the list
    return res
      .status(200)
      .json({ message: "Unsubscribed from the Bookbyte Letter." });
  } catch (err) {
    console.error(
      `Error occurred in file: newsletter controller, function: unsubscribe -`,
      err
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { subscribe, unsubscribe };
