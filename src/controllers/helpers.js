const { Reader, Book } = require('../models');

const getModel = (model) => {
    const models = {
        reader: Reader,
        book: Book       
    };

    return models[model];
}

const createEntry = async (res, model, entry) => {
    const Model = getModel(model);
    
    try {
        const newEntry = await Model.create(entry);

        res.status(201).json(newEntry);
    } catch (err) {
        const errorMsg = err.errors.map(e => e.message);
        res.status(400).json({ error: errorMsg[0] });
    }
};

module.exports = { getModel, createEntry };