const { createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById } = require('./helpers');

exports.createReader = (req, res) => createEntry(res, 'reader', req.body);
exports.getAllReaders = (_, res) => getAllEntry(res, 'reader');
exports.getReaderById = (req, res) => getEntryById(res, 'reader', req.params.id);
exports.updateReaderById = (req, res) => updateEntryById(res, 'reader', req.body, req.params.id);
exports.deleteReaderById = (req, res) => deleteEntryById(res, 'reader', req.params.id);
