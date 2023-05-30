const connection = require('../config/connection');
const { Book } = require('../models');
console.log(Book);
const fs = require('fs');
const path = require('path');
const bookDataPath = path.resolve(__dirname, 'bookData.json');
const bookData = fs.readFileSync(bookDataPath, 'utf-8');

const booksWithId = JSON.parse(bookData);
const books = booksWithId.map(({ id, ...rest }) => rest);

connection.on('error', (err) => err);

connection.once('open', async () => {
	console.log('Database connected');

	for (const book of books) {
		const newBook = new Book(book);
		console.log(newBook);
	}

	console.info('Seeding complete! 🌱');
	process.exit(0);
});
