const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

const createAuthor = (req, res) => createEntry(res, 'author', req.body);
const getAllAuthors = (_, res) => getAllEntry(res, 'author');
const getAuthorById = (req, res) => getEntryById(res, 'author', req.params.id);
const updateAuthorById = (req, res) => updateEntryById(res, 'author', req.body, req.params.id);
const deleteAuthorById = (req, res) => deleteEntryById(res, 'author', req.params.id);

module.exports = { createAuthor, getAllAuthors, getAuthorById, updateAuthorById, deleteAuthorById };