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
                isEmail: true,
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
                len: [8, ],
            }
        },
    };
  
    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
  };