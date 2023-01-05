const { Reader } = require('../models');

exports.createReader = async (req, res) => {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
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
          return res.status(404).json({ error: 'Reader does not exist' });
        }
        res.status(200).json(reader);
    } catch (err) {
        res.status(500).json(err.message);
    }
};