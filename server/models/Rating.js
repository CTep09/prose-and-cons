const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  ratingValue: {
    type: Number,
    min: 1,
    max: 5,
  },
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
