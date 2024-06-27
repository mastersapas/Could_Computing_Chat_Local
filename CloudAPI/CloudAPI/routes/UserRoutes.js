const router = require("express").Router();

const UserController = require("../controllers/UserController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get("/:username", [AuthMiddleware.check], UserController.get);
//router.post("/", UserController.create);

module.exports = router;
