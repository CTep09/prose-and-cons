const { Schema, model } = require('mongoose');

// Schema to create Book model
const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		authors: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Author',
			},
		],
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
		date_pub: {
			type: String,
		},
		num_pages: {
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

const Book = model('Book', bookSchema);

module.exports = Book;
