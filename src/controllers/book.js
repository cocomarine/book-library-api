const { Book } = require('../models');

exports.createBook = async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
};
