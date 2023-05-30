const { Schema, model } = require('mongoose');

// Schema to create Book model
const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
		},
		isbn: {
			type: String,
			unique: {
				partialFilterExpression: { isbn: { $type: 'string' } },
			},
		},
		isbn13: {
			type: String,
			unique: {
				partialFilterExpression: { isbn: { $type: 'string' } },
			},
		},
		date_pub_sort: {
			type: String,
		},
		date_pub: {
			type: String,
		},
		num_pages: {
			type: Number,
		},
		goodreads_rating_avg: {
			type: Number,
		},
		goodreads_rating_count: {
			type: Number,
		},
		cover_img_url: {
			type: String,
		},
	},
	{
		// Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
		// Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

const Book = model('book', bookSchema);

module.exports = Book;
