const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    library: [Rating]!
    friends: [User]!
    sentRecs: [Recommendation]!
    receivedRecs: [Recommendation]!
  }

  type Rating {
    _id: ID
    user: User
    book: Book
    ratingValue: Int
    readStatus: String
  }

  input RatingInput {
    ratingValue: Int
    readStatus: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Author {
    _id: ID
    firstName: String
    lastName: String
    sortName: String
    displayName: String
  }

  type Book {
    _id: ID
    title: String
    description: String
    authors: [Author]
    isbn: String
    isbn13: String
    date_pub: String
    num_pages: Int
    cover_img_url: String
    ratings: [Rating]!
  }

  input AuthorInput {
    firstName: String
    lastName: String
    displayName: String
    sortName: String
  }

  input BookInput {
    title: String
    description: String
    authors: [AuthorInput]
    isbn: String
    isbn13: String
    date_pub: String
    num_pages: Int
    cover_img_url: String
  }

  type Recommendation {
    sender: User
    recipient: User
    book: Book
    timestamp: String
    readStatus: String
    rating: Rating
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    books: [Book]
    book(bookId: ID!): Book
    recs(recipientId: ID!): [Recommendation]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(input: BookInput!): Book
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    addRating(ratingValue: Int!, bookId: ID!): Rating
    changeReadStatus(bookId: ID!, readStatus: String!): User
    makeRec(friendId: ID!, bookId: ID!): Recommendation
    removeRec(friendId: ID!, bookId: ID!): Recommendation
    saveBook(bookId: ID!, readStatus: String): User
    addOrUpdateRating(bookData: BookInput!, ratingData: RatingInput!): Rating
  }
`;

module.exports = typeDefs;
