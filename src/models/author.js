module.exports = (connection, DataTypes) => {
    const schema = {
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: "author is required"
                },
                notEmpty: {
                    msg: "author cannot be empty"
                },
            },
        },
    };

    const AuthorModel = connection.define('Author', schema);
    return AuthorModel;
};