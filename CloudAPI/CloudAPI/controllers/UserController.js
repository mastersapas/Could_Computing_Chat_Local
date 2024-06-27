const UserModel = require("../models/UserModel")

module.exports = {

    get: (req, res) => {
        UserModel.getUser(req.params.username)
            .then((value) => {
                //console.log(value)
                return res.status(200).json({
                    status: true,
                    data: {
                        username: value.username,
                        name: value.name,
                    }
                });
            })
            .catch((err) => {
                return res.status(404).json({
                    status: false,
                    error: err,
                });
            })
    },

    create: (req, res) => {
        const { body } = req;

        UserModel.createUser({
            username: body.username,
            password: body.password,
            name: body.name
        })
            .then((value) => {
                return res.status(201).json({
                    status: true,
                    user: value
                });
            })
            .catch((err) => {
                return res.status(404).json({
                    status: false,
                    error: err,
                });
            })
    }
}