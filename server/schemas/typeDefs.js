const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        library: [{
            book: Book
            readStatus: String
            ratingStatus: String
            rating: Rating
        }]
        friends: [User]!
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
        rating: Int
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
        book: Book
        books: [Book]
        recs(recipient:ID!): [Recommendation]
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addBook(input: BookInput!): Book
        addFriend(username: String!): User
        addRating(rating: Int!, bookId: ID!): Rating
        makeRec(username:String!, bookId: ID!): Recommendation
        saveBook(bookId: ID!,readStatus: String): User
        removeFriend(username: String!): User
        updateRating(rating: Int!, bookId: ID!): Rating
    }
`;
