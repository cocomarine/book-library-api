const { Reader } = require('../models');

exports.createReader = async (req, res) => {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
};