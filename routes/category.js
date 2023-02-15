const { Router } = require('express');
const { getAllCategory, createCategory, deleteCategory, changeCategory } = require("../controllers/category");
const { checkRoleMiddleware } = require("../middleware/checkRoleMiddleware")

const router = new Router();

router.get('/', getAllCategory)
router.post('/', checkRoleMiddleware, createCategory)
router.delete('/:id', checkRoleMiddleware, deleteCategory)
router.patch('/:id', checkRoleMiddleware, changeCategory)

module.exports = router