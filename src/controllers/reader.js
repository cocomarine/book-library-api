const { Reader } = require('../models');

exports.createReader = async (req, res) => {
    try {
        const newReader = await Reader.create(req.body);
        res.status(201).json(newReader);
    } catch (err) {
        const errorMsg = err.errors.map(e => e.message);
        res.status(400).json({ error: errorMsg[0] });
    }
};

exports.getAllReaders = async (_, res) => {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
};

exports.getReaderById = async (req, res) => {
    try {
        const readerId = req.params.id;
        const reader = await Reader.findByPk(readerId);

        if (!reader) {
          res.status(404).json({ error: 'reader does not exist' });
        }
        res.status(200).json(reader);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

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