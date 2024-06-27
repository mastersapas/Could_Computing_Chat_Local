const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        required: true
    },
});

module.exports = {

    initialise: async (mongoose) => {
        this.model = mongoose.model('Message', messageSchema);
    },

    getModel: () => {
        return this.model;
    },

    getLast25Messages: () => {
        return this.model.find().sort({ _id: -1 }).limit(100).exec()
    },

    getLast25MessagesByID: (id) => {
        return this.model.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(100).exec()
    },

    createMessage: (message) => {
        return this.model.create(message);
    }
}
