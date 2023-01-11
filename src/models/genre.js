module.exports = (connection, DataTypes) => {
    const schema = {
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: [true],
                msg: "genre needs to be unique"
            }, 
            validate: {
                notNull: {
                    args: [true],
                    msg: "genre is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "genre cannot be empty",
                },
            },
        },
    };

    const GenreModel = connection.define('Genre', schema);
    return GenreModel;
};