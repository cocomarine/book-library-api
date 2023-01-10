const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

exports.createBook = (req, res) => createEntry(res, 'book', req.body);
exports.getAllBooks = (_, res) => getAllEntry(res, 'book');
exports.getBookById = (req, res) => getEntryById(res, 'book', req.params.id);
exports.updateBookById = (req, res) => updateEntryById(res, 'book', req.body, req.params.id);
exports.deleteBookById = (req, res) => deleteEntryById(res, 'book', req.params.id);