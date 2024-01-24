const express = require('express');
const app = express();
app.use(express.json());

class Book {
    constructor(title, author, ISBN) {
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
    }

    displayInfo() {
        return `Title: ${this.title}, Author: ${this.author}, ISBN: ${this.ISBN}`;
    }
}

class EBook extends Book {
    constructor(title, author, ISBN, fileFormat) {
        super(title, author, ISBN);
        this.fileFormat = fileFormat;
    }

    displayInfo() {
        return `${super.displayInfo()}, File Format: ${this.fileFormat}`;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    displayBooks() {
        return this.books.map(book => book.displayInfo());
    }

    searchByTitle(title) {
        return this.books.filter(book => book.title.toLowerCase().includes(title.toLowerCase())).map(book => book.displayInfo());
    }
}

const library = new Library();

app.post('/addBook', (req, res) => {
    const { title, author, ISBN, fileFormat } = req.body;
    const book = fileFormat ? new EBook(title, author, ISBN, fileFormat) : new Book(title, author, ISBN);
    library.addBook(book);
    res.json({ message: 'Book added successfully' });
});

app.get('/listBooks', (req, res) => {
    res.json(library.displayBooks());
});

app.delete('/deleteBook', (req, res) => {
    const ISBN = req.query.ISBN;
    const index = library.books.findIndex(book => book.ISBN === ISBN);
    if (index !== -1) {
        library.books.splice(index, 1);
        res.json({ message: 'Book deleted successfully' });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
