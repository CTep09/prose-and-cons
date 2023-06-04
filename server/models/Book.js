const { Schema, model } = require("mongoose");

// Schema to create Book model
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
    isbn: {
      type: String,
      unique: {
        partialFilterExpression: { isbn: { $type: "string" } },
      },
    },
    isbn13: {
      type: String,
      unique: {
        partialFilterExpression: { isbn: { $type: "string" } },
      },
    },
    date_pub: {
      type: String,
    },
    num_pages: {
      type: Number,
    },
    cover_img_url: {
      type: String,
    },
    ratings: [{
      type: Schema.Types.ObjectId,
      ref: "Rating",

    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;
