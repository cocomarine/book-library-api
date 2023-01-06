const { Book } = require('../models');

exports.createBook = async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
};

exports.getAllBooks = async (req, res) => {
    const books = await Book.findAll();
    res.status(200).json(books);
};