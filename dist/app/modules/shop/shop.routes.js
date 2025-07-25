"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category/category.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// category rouets
router.post("/category/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.createCategory);
router.get("/category/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.getAllCategories);
router.get("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.getCategoryById);
router.put("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.updateCategory);
router.delete("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.deleteCategory);
exports.shopRouter = router;
