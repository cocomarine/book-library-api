const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

exports.createGenre = (req, res) => createEntry(res, 'genre', req.body);
exports.getAllGenres = (_, res) => getAllEntry(res, 'genre');
exports.getGenreById = (req, res) => getEntryById(res, 'genre', req.params.id);
exports.updateGenreById = (req, res) => updateEntryById(res, 'genre', req.body, req.params.id);
exports.deleteGenreById = (req, res) => deleteEntryById(res, 'genre', req.params.id);