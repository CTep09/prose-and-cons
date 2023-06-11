const { AuthenticationError } = require("apollo-server-express");
const { User, Book, Rating, Recommendation, Author } = require("../models");
const { signToken } = require("../utils/auth");

const populateFields = [
  {
    path: "library.book",
    populate: {
      path: "authors",
      model: "Author",
    },
  },
  {
    path: "library",
    populate: {
      path: "book",
      model: "Book",
    },
  },
  {
    path: "library",
    populate: {
      path: "rating",
      model: "Rating",
    },
  },
  {
    path: "friends",
    model: "User",
  },
];

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate(populateFields);
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username: username }).populate(populateFields);
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    books: async () => {
      return Book.find();
    },
    recs: async (parent, { recipientId }) => {
      return Recommendation.find({ recipient: recipientId })
        .populate("sender")
        .populate("book");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    addBook: async (parent, args, context) => {
      console.log(args);

      const bookData = {
        title: args.input.title,
        description: args.input.description,
        isbn: args.input.isbn,
        isbn13: args.input.isbn13,
        date_pub: args.input.date_pub,
        num_pages: args.input.num_pages,
        cover_img_url: args.input.cover_img_url,
      };
      const authorsArr = [...args.input.authors];

      const newBook = await Book.findOneAndUpdate(
        { title: bookData.title, isbn: bookData.isbn },
        { ...bookData },
        { upsert: true, new: true }
      );

      console.log(newBook);

      if (authorsArr) {
        // Use map to generate an array of promises
        const authorPromises = authorsArr.map(async (author) => {
          const nameArray = author.displayName.split(" ");
          const nameLength = nameArray.length;
          const firstName = nameArray.slice(0, nameLength - 1).join(" ");
          const lastName = nameArray[nameLength - 1];

          const newAuthor = await Author.findOneAndUpdate(
            { firstName, lastName },
            { firstName, lastName, $addToSet: { books: newBook._id } },
            { upsert: true, new: true }
          );

          return newAuthor._id; // Return the newAuthor's id to be added to newBook's authors list
        });

        // Wait until all the author updates are done
        newBook.authors = await Promise.all(authorPromises);

        await newBook.save();
      }

      const user = await User.findById(context.user._id);
      if (!user) {
        throw new Error("User not found!");
      }

      const bookExists = user.library.some(
        (userBook) => userBook.book.toString() === newBook._id
      );
      if (!bookExists) {
        user.library.push({ book: newBook._id });
        await user.save();
      }

      return newBook;
    },

    // addFriend(username: String!): User
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { friends: friendId },
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate("friends");
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // removeFriend(username: String!): User
    removeFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { friends: friendId },
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate("friends");
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // saveBook(bookId: ID!,readStatus: String): User
    saveBook: async (parent, { bookId, readStatus }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        if (!user) {
          throw new Error("User not found!");
        }

        const bookExists = user.library.some(
          (userBook) => userBook.book.toString() === bookId
        );
        if (bookExists) {
          throw new Error("Book already exists in the library!");
        }

        user.library.push({ book: bookId, readStatus: readStatus });
        await user.save();
        return user.populate("library.book");
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    // addRating(ratingValue: Int!, bookId: ID!): Rating
    addRating: async (parent, { bookId, ratingValue }, context) => {
      if (context.user) {
        // Locate the rating as it currently exists and update the value
        // If it doesn't exist, then create it
        const rating = await Rating.findOneAndUpdate(
          {
            user: context.user._id,
            book: bookId,
          },
          {
            user: context.user._id,
            book: bookId,
            ratingValue: ratingValue,
          },
          { upsert: true, new: true }
        );
        // Locate the user by ID
        const user = await User.findById(context.user._id);
        // Find the book in the User's library
        const index = user.library.findIndex(
          (obj) => obj.book.toString() === bookId
        );
        // If book not found in user's library, push it to the library with a readStatus of "Read"
        if (index === -1) {
          user.library.push({
            book: bookId,
            readStatus: "Read",
            ratingStatus: "Rated",
            rating: rating._id,
          });
        } else {
          // If book found, just update its ratingValue, ratingStatus and readStatus
          user.library[index].rating = rating._id;
          user.library[index].ratingStatus = "Rated";
          user.library[index].readStatus = "Read";
        }

        await user.save();

        // Find the book that's been rated and add the rating to
        // its ratings set
        const book = await Book.findOneAndUpdate(
          { _id: bookId },
          { $addToSet: { ratings: rating._id } },
          { new: true }
        );

        const recs = await Recommendation.find({
          recipient: context.user._id,
          book: bookId,
        });

        if (recs && recs.length > 0) {
          await Promise.all(
            recs.map((rec) =>
              Recommendation.findByIdAndUpdate(
                rec._id,
                {
                  rating: rating._id,
                  readStatus: "Read",
                },
                { new: true }
              )
            )
          );
        }

        return { rating, user, book };
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },

    changeReadStatus: async (parent, { bookId, readStatus }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);

        // Find the book in the User's library
        const index = user.library.findIndex(
          (obj) => obj.book.toString() === bookId
        );

        // If book not found in user's library, push it to the library with the chosen readStatus
        if (index === -1) {
          user.library.push({
            book: bookId,
            readStatus: readStatus,
          });
        } else {
          // If book found, just update its readStatus
          user.library[index].readStatus = readStatus;
        }
        await user.save();

        return user.populate(populateFields);
      }
    },

    // makeRec(username:String!, bookId: ID!): Recommendation
    removeRec: async (parent, { friendId, bookId }, context) => {
      const rec = await Recommendation.findOneAndDelete({
        sender: context.user._id,
        recipient: friendId,
        book: bookId,
      })
        .populate("sender")
        .populate("recipient")
        .populate("book");

      const sender = await User.findOneAndUpdate(
        {
          _id: context.user._id,
        },
        {
          $pull: { sentRecs: rec._id },
        },
        { new: true }
      );
      const recipient = await User.findOneAndUpdate(
        {
          _id: friendId,
        },
        {
          $pull: { receivedRecs: rec._id },
        },
        { new: true }
      );
      return rec;
    },
    makeRec: async (parent, { friendId, bookId }, context) => {
      const rec = await Recommendation.findOneAndUpdate(
        {
          sender: context.user._id,
          recipient: friendId,
          book: bookId,
        },
        {
          sender: context.user._id,
          recipient: friendId,
          book: bookId,
        },
        {
          upsert: true,
          new: true,
        }
      )
        .populate("sender")
        .populate("recipient")
        .populate("book");

      const sender = await User.findOneAndUpdate(
        {
          _id: context.user._id,
        },
        {
          $addToSet: { sentRecs: rec._id },
        },
        { new: true }
      );
      const recipient = await User.findOneAndUpdate(
        {
          _id: friendId,
        },
        {
          $addToSet: { receivedRecs: rec._id },
        },
        { new: true }
      );
      return { rec, sender, recipient };
    },
  },
};

module.exports = resolvers;
