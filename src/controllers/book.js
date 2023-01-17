const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

const createBook = (req, res) => createEntry(res, 'book', req.body);
const getAllBooks = (_, res) => getAllEntry(res, 'book');
const getBookById = (req, res) => getEntryById(res, 'book', req.params.id);
const updateBookById = (req, res) => updateEntryById(res, 'book', req.body, req.params.id);
const deleteBookById = (req, res) => deleteEntryById(res, 'book', req.params.id);

module.exports = { createBook, getAllBooks, getBookById, updateBookById, deleteBookById };