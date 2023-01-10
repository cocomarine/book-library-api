const { Book } = require('../models');
const { createEntry } = require('./helpers');

exports.createBook = (req, res) => createEntry(res, 'book', req.body);

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
    };
};

exports.updateBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateData = req.body;
        const book = await Book.findByPk(bookId);
        const [ updatedRows ] = await Book.update(updateData, { where: { id: bookId }});

        if (!book) {
            res.status(404).json({ error: 'book does not exist'});
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json(err.message);
    };
};

exports.deleteBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findByPk(bookId);
        const deletedRows = await Book.destroy({ where: { id: bookId } });

        if (!book) {
            res.status(404).json({ error: 'book does not exist'});
        }

        res.status(204).json(deletedRows);
    } catch (err) {
        res.status(500).json(err.message);
    };
};