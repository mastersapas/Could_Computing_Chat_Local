const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const { port, MongoDBConnectionString } = require("./config");
const PORT = process.env.PORT || port;

const app = express();
app.use(cors());
app.use(express.json());

const UserModel = require('./models/UserModel');
const MessageModel = require('./models/MessageModel')

const UserRoutes = require('./routes/UserRoutes')
const MessageRoutes = require('./routes/MessageRoutes')
const AuthRoutes = require('./routes/AuthRoutes')

UserModel.initialise(mongoose);
MessageModel.initialise(mongoose)

//mongoose.connect(MongoDBConnectionString + "ChatDB")
mongoose.connect('mongodb://mongodb:27017/ChatDB')
    .then(() => {
        console.log('Connected to DB!');

        return UserModel.getModel().syncIndexes() && MessageModel.getModel().syncIndexes();
    })
    .then(() => {
        console.log('Indexes synchronized successfully');

        app.use("/", AuthRoutes);
        app.use("/user", UserRoutes);
        app.use("/message", MessageRoutes)

        app.get("/status", (req, res) => {
            const status = {
                "Status": "Server Running"
            };

            res.send(status);
        });

        app.listen(PORT, () => {
            if (process.env.PORT) {
                console.log("Listening on PORT:", PORT);
            } else {
                console.log("Listening on: http://localhost:", PORT);
            }
        });
    })
    .catch(err => console.log(err.message));

function getID(){
    return id;
}




