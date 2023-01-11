module.exports = (connection, DataTypes) => {
    const schema = {
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: [true],
                msg: "author already exists"
            },
            validate: {
                notNull: {
                    args: [true],
                    msg: "author is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "author cannot be empty"
                },
            },
        },
    };

    const AuthorModel = connection.define('Author', schema);
    return AuthorModel;
};