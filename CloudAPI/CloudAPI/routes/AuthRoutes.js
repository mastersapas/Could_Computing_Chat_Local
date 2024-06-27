const router = require("express").Router();

const AuthController = require("../controllers/AuthController");
const ValidationMiddleware = require("../middlewares/ValidationMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const registerPayload = require("../payloads/RegisterPayload");
const loginPayload = require("../payloads/LoginPayload");

router.post(
  "/signup",
  [ValidationMiddleware.verify(registerPayload)],
  AuthController.register
);

router.post(
  "/login",
  [ValidationMiddleware.verify(loginPayload)],
  AuthController.login
);

router.post(
  "/check",
  [AuthMiddleware.check],
  AuthController.check
)

module.exports = router;