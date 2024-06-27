const mongoose = require('mongoose');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
});

const encryptPassword = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);

  return hash.digest("hex");
};

module.exports = {

  initialise: async (mongoose) => {
    this.model = mongoose.model('User', userSchema);

    if (await this.model.findOne({ username: "root" }).exec() == null) {
      await this.model.create({
        username: "root",
        password: encryptPassword("12345"),
        name: "root"
      });
    }
  },

  getModel: () => {
    return this.model;
  },

  getUser: (username) => {
    return this.model.findOne({ username: username }).exec()
  },

  createUser: (user) => {
    //console.log(user)
    return this.model.create(user);
  }
}
