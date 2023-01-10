const { Reader } = require('../models');
const { createEntry, getAllEntry, getEntryById } = require('./helpers');

exports.createReader = (req, res) => createEntry(res, 'reader', req.body);
exports.getAllReaders = (_, res) => getAllEntry(res, 'reader');
exports.getReaderById = (req, res) => getEntryById(res, 'reader', req.params.id);

exports.updateReaderById = async (req, res) => {
    try {
        const readerId = req.params.id;
        const updateData = req.body;
        const reader = await Reader.findByPk(readerId);
        const [ updatedRows ] = await Reader.update(updateData, { where: { id: readerId} });

        if (!reader) {
            res.status(404).json({ error: 'reader does not exist' });
        }

        res.status(200).json(updatedRows);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

exports.deleteReaderById = async (req, res) => {
    try {
        const readerId = req.params.id;
        const reader = await Reader.findByPk(readerId);
        const deletedRows = await Reader.destroy({ where: { id: readerId } });

        if (!reader) {
            res.status(404).json({ error: 'reader does not exist' });
        }

        res.status(204).json(deletedRows);
    } catch (err) {
        res.status(500).json(err.message);
    }

};

