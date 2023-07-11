const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  ratingValue: {
    type: Number,
    min: 0,
    max: 5,
  },
  readStatus: {
    type: String,
    enum: ["Read", "Want to Read", "On the Fence", "Not Interested"],
  },
});

// pre save middleware to automatically update readStatus and ratingValue
ratingSchema.pre("save", function (next) {
  // If readStatus is changed to "Want to Read" or "Not Interested"
  if (
    this.readStatus === "Want to Read" ||
    this.readStatus === "Not Interested" ||
    this.readStatus === "On the Fence"
  ) {
    this.ratingValue = 0;
  }

  // If ratingValue is set to a number greater than 0
  if (this.ratingValue > 0) {
    this.readStatus = "Read";
  }

  next();
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
