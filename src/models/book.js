module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "title is required"
                },
                notEmpty: {
                    msg: "title cannot be empty"
                },
            },
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "author is required"
                },
                notEmpty: {
                    msg: "author cannot be empty"
                },
            },
        },
        genre: DataTypes.STRING,
        ISBN: DataTypes.STRING,
    };

    const BookModel = connection.define('Book', schema);
    return BookModel;
};