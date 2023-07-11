const connection = require("../config/connection");
const { Book, Author, User, Rating, Recommendation } = require("../models");
const fs = require("fs");
const path = require("path");

const seedUsers = async () => {
  const userDataPath = path.resolve(__dirname, "userData.json");
  const userData = fs.readFileSync(userDataPath, "utf-8");
  const users = JSON.parse(userData);

  try {
    await User.deleteMany({});
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create({ ...user });
      createdUsers.push(createdUser);
    }

    for (const user of createdUsers) {
      const friends = createdUsers
        .filter((friend) => String(friend._id) !== String(user._id))
        .sort(() => Math.random() - Math.random())
        .slice(0, 3); // 3 random friends for each user

      user.friends = friends.map((friend) => friend._id);
      await user.save();
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

    const userList = [
      "user1",
      "user2",
      "user3",
      "user4",
      "alice1",
      "bob2",
      "charlie3",
      "david4",
      "emily5",
      "frank6",
      "george7",
      "hannah8",
    ];
    const readStatusList = [
      "Read",
      "Want to Read",
      "On the Fence",
      "Not Interested",
    ];

    for (const book of allBooks) {
      const userNumber = Math.floor(Math.random() * userList.length);
      const statusNumber = Math.floor(Math.random() * 4);

      const randomUsername = userList[userNumber];
      const currentUser = await User.findOne({ username: randomUsername });

      const randomReadStatus = readStatusList[statusNumber];
      const randomRating = Math.floor(Math.random() * 5 + 1);

      let rating;

      if (randomReadStatus == "Read") {
        rating = await Rating.create({
          user: currentUser._id,
          book: book._id,
          ratingValue: randomRating,
          readStatus: randomReadStatus,
        });
      } else {
        rating = await Rating.create({
          user: currentUser._id,
          book: book._id,
          ratingValue: 0,
          readStatus: randomReadStatus,
        });
      }

      currentUser.library.push(rating);
      await currentUser.save();
    }
    console.info("Successfully seeded user libraries and ratings.");
  } catch (error) {
    console.error("Error seeding the books and authors:", error);
  }
};

const seedRecommendations = async () => {
  try {
    // clear any existing recommendations
    await Recommendation.deleteMany({});
    const allUsers = await User.find({})
      .populate("library")
      .populate("friends");

    for (const user of allUsers) {
      const userBooks = user.library.map((rating) => String(rating.book));

      let recommendationsMade = 0;
      for (const friend of user.friends) {
        if (recommendationsMade >= 3) break;
        const friendLibrary = await User.findOne({ _id: friend._id }).populate(
          "library"
        );

        for (const rating of friendLibrary.library) {
          if (!userBooks.includes(String(rating.book))) {
            const recommendation = await Recommendation.create({
              sender: user._id,
              recipient: friend._id,
              book: rating.book,
              rating: null, // as it is a new recommendation, it doesn't have a rating yet
            });

            user.sentRecs.push(recommendation);
            await user.save();

            friend.receivedRecs.push(recommendation);
            await friend.save();

            recommendationsMade += 1;
            break;
          }
        }
      }
    }
    console.info("Successfully seeded recommendations.");
  } catch (error) {
    console.error("Error seeding recommendations:", error);
  }
};

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Database connected");

  await seedUsers();
  await seedBooks();
  await seedLibraries();
  await seedRecommendations();

  console.info("Seeding complete! 🌱");
  process.exit(0);
});
