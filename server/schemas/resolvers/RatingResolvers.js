const { AuthenticationError } = require("apollo-server-express");
const { User, Book, Rating } = require("../../models");

const resolvers = {
  Mutation: {
    addOrUpdateRating: async (parent, { bookData, ratingData }, context) => {
      if (context.user) {
        // Upsert the book
        let newBook = await Book.findOneAndUpdate(
          { title: bookData.title, isbn: bookData.isbn },
          { ...bookData },
          { upsert: true, new: true }
        );

        // Upsert the rating
        const rating = await Rating.findOneAndUpdate(
          { user: context.user._id, book: newBook._id },
          { ...ratingData },
          { new: true, upsert: true }
        ).populate("book");

        // Add rating to user's library
        await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { library: rating._id } },
          { new: true }
        );

        // Add rating to book's ratings array
        await Book.findByIdAndUpdate(
          newBook._id,
          { $addToSet: { ratings: rating._id } },
          { new: true }
        );

        return rating;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
