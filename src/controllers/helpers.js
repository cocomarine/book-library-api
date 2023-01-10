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

const getAllEntry = async (res, model) => {
    const Model = getModel(model);

    const entry = await Model.findAll();
    res.status(200).json(entry);
}

const getEntryById = async (res, model, id) => {
    const Model = getModel(model);

    try {
        const entry = await Model.findByPk(id);
        if (!entry) {
            res.status(404).json({ error: `${model} does not exist` });
        }
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

const updateEntryById = async (res, model, entry, id) => {
    try {
        const Model = getModel(model);
        const entryToBeUpdated = await Model.findByPk(id);

        if (!entryToBeUpdated) {
            res.status(404).json({ error: `${model} does not exist` })
        }

        const [ updatedEntry ] = await Model.update(entry, { where: { id }});
        
        res.status(200).json(updatedEntry);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

module.exports = { getModel, createEntry, getAllEntry, getEntryById, updateEntryById };