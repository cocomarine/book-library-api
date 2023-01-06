const { Book } = require('../models');

exports.createBook = async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
};

exports.getAllBooks = async (_, res) => {
    const books = await Book.findAll();
    res.status(200).json(books);
};

exports.getBookById= async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);

        if (!book) {
            res.status(404).json({ error: 'book does not exist' });
        }
        
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err.message);
    }
};