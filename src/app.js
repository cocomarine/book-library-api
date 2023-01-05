const express = require('express');
const { Reader } = require('./models');
const readerController = require('./controllers/reader');

const app = express();

app.use(express.json());

app.post('/readers', readerController.createReader);

module.exports = app;
