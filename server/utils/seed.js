const connection = require("../config/connection");
const { Book, Author } = require("../models");
const fs = require("fs");
const path = require("path");
const bookDataPath = path.resolve(__dirname, "bookData.json");
const bookData = fs.readFileSync(bookDataPath, "utf-8");

const books = JSON.parse(bookData);

// Iterate over each book object
for (const book of books) {
  // Check each property and replace empty strings with null
  for (const prop in book) {
    if (book[prop] === "") {
      book[prop] = null;
    }
  }
}

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Database connected");

  try {
    await Book.deleteMany({});
    await Author.deleteMany({});

    for (const book of books) {
      const authors = [];

      for (const authorName of book.authors) {
        const [lastName, firstName] = authorName.split(", ");
        const author = await Author.findOneAndUpdate(
          { firstName, lastName },
          { firstName, lastName },
          { upsert: true, new: true }
        );

        authors.push(author._id);
      }

      const newBook = {
        title: book.title,
        description: book.description,
        authors,
        isbn: book.isbn,
        isbn13: book.isbn13,
        date_pub: book.date_pub,
        num_pages: book.num_pages,
        cover_img_url: book.cover_img_url,
      };

      await Book.findOneAndUpdate({ ...newBook }, newBook, {
        upsert: true,
        new: true,
      });
    }

    console.info("Seeding complete! 🌱");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    process.exit(0);
  }
});
