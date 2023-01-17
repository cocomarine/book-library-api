const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

const createReader = (req, res) => createEntry(res, 'reader', req.body);
const getAllReaders = (_, res) => getAllEntry(res, 'reader');
const getReaderById = (req, res) => getEntryById(res, 'reader', req.params.id);
const updateReaderById = (req, res) => updateEntryById(res, 'reader', req.body, req.params.id);
const deleteReaderById = (req, res) => deleteEntryById(res, 'reader', req.params.id);

module.exports = { createReader, getAllReaders, getReaderById, updateReaderById, deleteReaderById };