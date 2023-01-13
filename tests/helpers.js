const errorNull = (entry) => `${entry} is required`;
const errorEmpty = (entry) => `${entry} cannot be empty`;
const errorNotUnique = (entry) => `${entry} already exists`;
const errorNotPresent = (entry) => `${entry} does not exist`;

module.exports = { errorNull, errorEmpty, errorNotUnique, errorNotPresent };
