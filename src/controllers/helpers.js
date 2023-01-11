const { Reader, Book, Author, Genre } = require('../models');
const getError404 = (model) => ({ error: `${model} does not exist` });

const getModel = (model) => {
    const models = {
        reader: Reader,
        book: Book,
        author: Author,  
        genre: Genre,     
    };

    return models[model];
};

const getOptions = (model) => {
    if (model === 'book') return { include: [Genre, Author] };
    if (model === 'genre' || model === 'author') return { include: Book }; 

    return {};
};

const removePswd = (obj) => {
    if (obj.hasOwnProperty('password')) {
        delete obj.password;
    }
  
    return obj;
  };

const createEntry = async (res, model, entry) => {
    const Model = getModel(model);
    
    try {
        const newEntry = await Model.create(entry);
        const entryWithoutPswd = removePswd(newEntry.get());

        res.status(201).json(entryWithoutPswd);
    } catch (err) {
        const errorMsg = err.errors.map(e => e.message);
        res.status(400).json({ error: errorMsg[0] });
    }
};

const getAllEntry = async (res, model) => {
    const Model = getModel(model);
    const entries = await Model.findAll(getOptions(model));
    const entryWithoutPswd = entries.map(entry => {
        return removePswd(entry.get());
    });

    res.status(200).json(entryWithoutPswd);
};

const getEntryById = async (res, model, id) => {
    const Model = getModel(model);
    const entry = await Model.findByPk(id, getOptions(model));

    try {
        if (!entry) {
            res.status(404).json(getError404(model));
        }

        const entryWithoutPswd = removePswd(entry.get());

        res.status(200).json(entryWithoutPswd);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

const updateEntryById = async (res, model, entry, id) => {
        const Model = getModel(model);
        const [ entryUpdated ] = await Model.update(entry, { where: { id } });

    try {
        if (!entryUpdated) {
            res.status(404).json(getError404(model));
        }

        const updatedEntry = await Model.findByPk(id);
        const entryWithoutPswd = removePswd(updatedEntry.get());
        
        res.status(200).json(entryWithoutPswd);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

const deleteEntryById = async (res, model, id) => {
        const Model = getModel(model);
        const deletedEntry = await Model.destroy({ where: { id } });

    try {
        if (!deletedEntry) {
            res.status(404).json(getError404(model));
        }

        res.status(204).json(deletedEntry);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

module.exports = { getModel, createEntry, getAllEntry, getEntryById, updateEntryById, deleteEntryById };