const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		_id: ID
		username: String
		email: String
		password: String
		library: [Book]!
		friends: [User]!
	}

	type Book {
		_id: ID
		title: String
		author: String
		isbn: String
		isbn13: String
		date_pub: String
		num_pages: Int
		cover_img_url: String
	}
`;
