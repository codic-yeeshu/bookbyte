const mongoose = require("mongoose");

const newsletterSubscriber = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "subscribed",
      enum: ["subscribed", "unsubscribed"],
    },
  },
  { timestamps: true }
);

const NewsletterSubscriber = mongoose.model(
  "newsletterSubscriber",
  newsletterSubscriber
);
module.exports = NewsletterSubscriber;
