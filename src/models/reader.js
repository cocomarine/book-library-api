module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: [true],
                msg: "name already exists"
            },
            validate: {
                notNull: {
                    args: [true],
                    msg: "name is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "name cannot be empty"
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: [true],
                msg: "email already exists"
            },
            validate: {
                notNull: {
                    args: [true],
                    msg: "email is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "email cannot be empty"
                },
                isEmail: {
                    args: [true],
                    msg: "email is in incorrect format"
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: "password is required"
                },
                notEmpty: {
                    args: [true],
                    msg: "password cannot be empty"
                },
                len: {
                    args: [9, ],
                    msg: "password should be longer than 8 characters"
                },
            },
        },
        // books: DataTypes.STRING
    };
  
    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
  };