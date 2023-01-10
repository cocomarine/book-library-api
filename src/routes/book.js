const express = require('express');
const bookController = require('../controllers/book');

const bookRouter = express.Router();

bookRouter.post('/', bookController.createBook);
bookRouter.get('/', bookController.getAllBooks);
bookRouter.get('/:id', bookController.getBookById);
bookRouter.patch('/:id', bookController.updateBookById);
bookRouter.delete('/:id', bookController.deleteBookById);

module.exports = bookRouter;