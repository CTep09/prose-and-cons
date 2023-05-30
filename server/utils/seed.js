const connection = require('../config/connection');
const { Book } = require('../models');
console.log(Book);
const fs = require('fs');
const path = require('path');
const bookDataPath = path.resolve(__dirname, 'bookData.json');
const bookData = fs.readFileSync(bookDataPath, 'utf-8');

const booksWithId = JSON.parse(bookData);

// Remove the _id field from the data
const books = booksWithId.map(({ _id, ...rest }) => rest);

// Iterate over each book object
for (const book of books) {
	// Check each property and replace empty strings with null
	for (const prop in book) {
		if (book[prop] === '') {
			book[prop] = null;
		}
	}
}

connection.on('error', (err) => err);

connection.once('open', async () => {
	console.log('Database connected');

	try {
		await Book.deleteMany({});

		const uniqueBooks = new Set();

		for (const book of books) {
			const { title, author } = book;
			const bookIdentifier = `${title}_${author}`;

			// Check if the book is already in the set (duplicate)
			if (uniqueBooks.has(bookIdentifier)) {
				console.log(`Skipping duplicate book: ${title} by ${author}`);
				continue;
			}

			// Save the book to the database
			const newBook = new Book(book);
			await newBook.save();

			// Add the book identifier to the set
			uniqueBooks.add(bookIdentifier);
		}

		console.info('Seeding complete! 🌱');
	} catch (error) {
		console.error('Error seeding the database:', error);
	} finally {
		process.exit(0);
	}
});
