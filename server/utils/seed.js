const connection = require("../config/connection");
const { Book, Author, User, Rating } = require("../models");
const fs = require("fs");
const path = require("path");

const seedUsers = async () => {
  const userDataPath = path.resolve(__dirname, "userData.json");
  const userData = fs.readFileSync(userDataPath, "utf-8");
  const users = JSON.parse(userData);

  try {
    await User.deleteMany({});
    for (const user of users) {
      await User.create({ ...user });
    }
    console.info("Successfully seeded users.");
  } catch (e) {
    console.error("Error seeding users:", error);
  }
};

const seedBooks = async () => {
  const bookDataPath = path.resolve(__dirname, "bookData.json");
  const bookData = fs.readFileSync(bookDataPath, "utf-8");
  const books = JSON.parse(bookData);
  // Clean up empty strings from messy seed data
  for (const book of books) {
    // Check each property and replace empty strings with null
    for (const prop in book) {
      if (book[prop] === "") {
        book[prop] = null;
      }
    }
  }

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

      const createdBook = await Book.findOneAndUpdate({ ...newBook }, newBook, {
        upsert: true,
        new: true,
      });

      const createdBookAuthors = createdBook.authors;

      createdBookAuthors.forEach(async (authorId) => {
        await Author.findOneAndUpdate(
          { _id: authorId },
          { $addToSet: { books: createdBook._id } },
          { new: true }
        );
      });
    }

    console.info("Successfully seeded books and authors.");
  } catch (error) {
    console.error("Error seeding the books and authors:", error);
  }
};

const seedLibraries = async () => {
  try {
    // clear any existing ratings
    await Rating.deleteMany({});

    const allBooks = await Book.find({});

    const userList = ["user1", "user2", "user3", "user4"];
    const readStatusList = ["Read", "Want to Read", "Not Interested"];

    for (const book of allBooks) {
      const userNumber = Math.floor(Math.random() * 4);
      const statusNumber = Math.floor(Math.random() * 3);
      const ratedOrNot = Math.floor(Math.random() * 100);

      const randomUsername = userList[userNumber];
      const currentUser = await User.findOne({ username: randomUsername });

      const randomStatus = readStatusList[statusNumber];
      let ratingStatus = "Unrated";
      if (randomStatus === "Read" && ratedOrNot > 25) {
        ratingStatus = "Rated";
      }
      const randomRating = Math.floor(Math.random() * 5 + 1);

      let rating = null;

      if (ratingStatus === "Rated") {
        rating = await Rating.create({
          user: currentUser._id,
          book: book._id,
          ratingValue: randomRating,
        });
      }

      const userBook = {
        book: book._id,
        readStatus: randomStatus,
        ratingStatus: ratingStatus,
        rating: rating?._id,
      };

      currentUser.library.push(userBook);
      await currentUser.save();
    }
    console.info("Successfully seeded user libraries and ratings.");
  } catch (error) {
    console.error("Error seeding the books and authors:", error);
  }
};

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Database connected");

  await seedUsers();
  await seedBooks();
  await seedLibraries();

  console.info("Seeding complete! 🌱");
  process.exit(0);
});
