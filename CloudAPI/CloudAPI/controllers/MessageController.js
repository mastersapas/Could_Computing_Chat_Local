const MessageModel = require("../models/MessageModel")

module.exports = {

    getLast25: (req, res) => {
        MessageModel.getLast25Messages()
            .then((value) => {
                return res.status(200).json({
                    status: true,
                    data: {
                       value
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

    getLast25ByID: (req, res) => {
        MessageModel.getLast25MessagesByID(req.params.id)
            .then((value) => {
                return res.status(200).json({
                    status: true,
                    data: {
                        value
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
        const { body } = req

        MessageModel.createMessage({
            username: body.username,
            name: body.name,
            msg: body.msg
        })
            .then((value) => {
                return res.status(201).json({
                    status: true,
                    message: value
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