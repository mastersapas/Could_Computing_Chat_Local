const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../models/UserModel");

const { jwtSecret, jwtExpirationInSeconds } = require("../config");
const { check } = require("../middlewares/AuthMiddleware");

const generateAccessToken = (username, _id) => {
    return jwt.sign(
        {
            _id,
            username,
        },
        jwtSecret,
        {
            expiresIn: jwtExpirationInSeconds,
        }
    );
};

const encryptPassword = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);

    return hash.digest("hex");
};

module.exports = {
    register: (req, res) => {
        const payload = req.body;

        let encryptedPassword = encryptPassword(payload.password);

        UserModel.createUser(Object.assign(payload, { password: encryptedPassword }))
            .then((user) => {
                const accessToken = generateAccessToken(payload.username, user._id);

                return res.status(201).json({
                    status: true,
                    data: {
                        username: user.username,
                        name: user.name,
                        token: accessToken,
                    },
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
            });
    },

    login: (req, res) => {
        const { username, password } = req.body;

        UserModel.getUser(username)
            .then((user) => {
                if (!user) {
                    return res.status(400).json({
                        status: false,
                        error: {
                            message: `Could not find any user with username: \`${username}\`.`,
                        },
                    });
                }

                const encryptedPassword = encryptPassword(password);

                if (user.password !== encryptedPassword) {
                    return res.status(400).json({
                        status: false,
                        error: {
                            message: `Provided username and password did not match.`,
                        },
                    });
                }

                const accessToken = generateAccessToken(user.username, user.id);

                return res.status(200).json({
                    status: true,
                    data: {
                        username: user.username,
                        name: user.name,
                        token: accessToken,
                    },
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
            });
    },

    check: (req, res) => {
        return res.status(200).json({
            status: true,
            message: "Valid Token!"
        });
    }
};