const { AuthenticationError } = require("apollo-server-express");
const { User, Book, Rating, Recommendation, Author } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username: username });
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    books: async () => {
      return Book.find();
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

    // addBook(input: BookInput!): Book
    addBook: async (parent, args) => {
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
        authorsArr.forEach(async (author) => {
          const nameArray = author.displayName.split(" ");
          const nameLength = nameArray.length;
          const firstName = nameArray.slice(0, nameLength - 1).join(" ");
          const lastName = nameArray[nameLength - 1];

          const newAuthor = await Author.findOneAndUpdate(
            { firstName, lastName },
            { firstName, lastName, $addToSet: { books: newBook._id } },
            { upsert: true, new: true }
          );

          newBook.authors.push(newAuthor._id);
          console.log(newAuthor);
          console.log(newBook);
        });
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
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // saveBook(bookId: ID!,readStatus: String): User
    saveBook: async (parent, { bookId, readStatus }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              library: { book: bookId, readStatus: readStatus },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // addRating(ratingValue: Int!, bookId: ID!): Rating
    addRating: async (parent, { bookId, ratingValue }, context) => {
      if (context.user) {
        const rating = await Rating.create({
          user: context.user._id,
          book: bookId,
          ratingValue: ratingValue,
        });
        const user = await User.findById(context.user._id);
        const index = user.library.findIndex((obj) => obj.book === bookId);
        user.library[index].rating = rating._id;
        user.library[index].ratingStatus = "Rated";
        const book = await Book.findById(bookId);
        book.ratings.push(rating._id);
        return rating;
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // updateRating(ratingValue: Int!, ratingId: ID!): Rating
    updateRating: async (parent, { ratingId, ratingValue }, context) => {
      if (context.user) {
        const rating = Rating.findOneAndUpdate(
          { _id: ratingId },
          { ratingValue: ratingValue },
          { new: true }
        );
        return rating;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // makeRec(username:String!, bookId: ID!): Recommendation
    makeRec: async (parent, { userId, bookId }, context) => {
      const rec = await Recommendation.create({
        sender: context.user._id,
        recipient: userId,
        book: bookId,
      });
      return rec;
    },
  },
};

module.exports = resolvers;
