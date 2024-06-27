const router = require("express").Router();

const MessageController = require("../controllers/MessageController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get("/last25/:id", [AuthMiddleware.check], MessageController.getLast25ByID);
router.get("/last25", [AuthMiddleware.check], MessageController.getLast25);
router.post("/", [AuthMiddleware.check], MessageController.create);

module.exports = router;
