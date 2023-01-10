module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "name is required"
                },
                notEmpty: {
                    msg: "name cannot be empty"
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "email is required"
                },
                notEmpty: {
                    msg: "email cannot be empty"
                },
                isEmail: {
                    msg: "email is in incorrect format"
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "password is required"
                },
                notEmpty: {
                    msg: "password cannot be empty"
                },
                len: {
                    args: [9, ],
                    msg: "password should be longer than 8 characters"
                },
            }
        },
    };
  
    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
  };