const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

exports.createAuthor = (req, res) => createEntry(res, 'author', req.body);
exports.getAllAuthors = (_, res) => getAllEntry(res, 'author');
exports.getAuthorById = (req, res) => getEntryById(res, 'author', req.params.id);
exports.updateAuthorById = (req, res) => updateEntryById(res, 'author', req.body, req.params.id);
exports.deleteAuthorById = (req, res) => deleteEntryById(res, 'author', req.params.id);