const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    library: [UserBook]!
    friends: [User]!
  }

  type UserBook {
    book: Book
    readStatus: String
    ratingStatus: String
    rating: Rating
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

  type Rating {
    user: User
    book: Book
    ratingValue: Int
  }

  type Recommendation {
    sender: User
    recipient: User
    book: Book
    timestamp: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    books: [Book]
    book(bookId: ID!): Book
    recs(recipient: ID!): [Recommendation]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(input: BookInput!): Book
    addFriend(username: String!): User
    addRating(ratingValue: Int!, bookId: ID!): Rating
    makeRec(username: String!, bookId: ID!): Recommendation
    saveBook(bookId: ID!, readStatus: String): User
    removeFriend(username: String!): User
    updateRating(ratingId: ID!, ratingValue: Int!): Rating
  }
`;

module.exports = typeDefs;
