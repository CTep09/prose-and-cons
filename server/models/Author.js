const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

authorSchema
  .virtual("displayName")
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (strArg) {
    const nameArray = strArg.split(" ");
    const nameLength = nameArray.length;
    const firstName = nameArray.slice(0, nameLength - 1).join(" ");
    const lastName = nameArray[nameLength - 1];
    this.set({
      firstName: firstName,
      lastName: lastName,
    });
  });

authorSchema
  .virtual("sortName")
  .get(function () {
    return `${this.lastName}, ${this.firstName}`;
  })
  .set(function (strArg) {
    const nameArray = strArg.split(",");
    const firstName = nameArray[1].trim();
    const lastName = nameArray[0].trim();
    this.set({
      firstName: firstName,
      lastName: lastName,
    });
  });

const Author = model("Author", authorSchema);

module.exports = Author;
