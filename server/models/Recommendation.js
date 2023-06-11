const { Schema, model } = require("mongoose");

const recommendationSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    readStatus: {
      type: String,
      enum: ["Read", "Want to Read", "Not Interested"],
    },
    rating: { type: Schema.Types.ObjectId, ref: "Rating" },
    timestamp: {
      type: Date,
      default: Date.now,
      get: function (date) {
        const dateFormatOptions = {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
        };
        const timeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedDate = date.toLocaleDateString(
          undefined,
          dateFormatOptions
        );
        const formattedTime = date.toLocaleTimeString(
          undefined,
          timeFormatOptions
        );

        return `${formattedDate} at ${formattedTime}`;
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const Recommendation = model("Recommendation", recommendationSchema);

module.exports = Recommendation;
