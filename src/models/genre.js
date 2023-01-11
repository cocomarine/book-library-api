module.exports = (connection, DataTypes) => {
    const schema = {
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: [true],
                msg: "genre already exists"
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