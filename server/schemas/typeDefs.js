const { gql } = require('apollo-server-express');

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

	type Book {
		_id: ID
		title: String
		authors: [Author]
		isbn: String
		isbn13: String
		date_pub: String
		num_pages: Int
		cover_img_url: String
	}

    type Author {
        _id: ID
        firstName: String
        lastName: String
        sortName: String
        displayName: String
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
        rating: Rating
        timestamp: String
    }

    type Query {

    }

    type Mutation {

    }




`;
