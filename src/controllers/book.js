const { Book } = require('../models');
const { createEntry, getAllEntry, getEntryById } = require('./helpers');

exports.createBook = (req, res) => createEntry(res, 'book', req.body);
exports.getAllBooks = (_, res) => getAllEntry(res, 'book');
exports.getBookById = (req, res) => getEntryById(res, 'book', req.params.id);

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