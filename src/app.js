const express = require('express');
const { Reader } = require('./models');
const readerController = require('./controllers/reader');

const app = express();

app.use(express.json());

app.post('/readers', readerController.createReader);
app.get('/readers', readerController.getAllReaders);
app.get('/readers/:id', readerController.getReaderById);
app.patch('/readers/:id', readerController.updateReaderById);
app.delete('/readers/:id', readerController.deleteReaderById);

module.exports = app;
