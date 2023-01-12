module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "title is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "title cannot be empty"
                },
            },
        },
        ISBN: {
            type: DataTypes.STRING,
            unique: {
                args: [true],
                msg: "ISBN already exists"
            },
        },
    };

    const BookModel = connection.define('Book', schema);
    return BookModel;
};