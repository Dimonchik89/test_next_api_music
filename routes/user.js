const { Router } = require("express");
const { register, login, auth } = require("../controllers/user");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = new Router();

router.post("/register", register)
router.post("/login", login)
router.get("/auth", authMiddleware, auth)

module.exports = router