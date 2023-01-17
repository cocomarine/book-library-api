const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

const createGenre = (req, res) => createEntry(res, 'genre', req.body);
const getAllGenres = (_, res) => getAllEntry(res, 'genre');
const getGenreById = (req, res) => getEntryById(res, 'genre', req.params.id);
const updateGenreById = (req, res) => updateEntryById(res, 'genre', req.body, req.params.id);
const deleteGenreById = (req, res) => deleteEntryById(res, 'genre', req.params.id);

module.exports = { createGenre, getAllGenres, getGenreById, updateGenreById, deleteGenreById };