"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category/category.controller");
const pin_controller_1 = require("./pin/pin.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = (0, express_1.Router)();
// category rouets
router.post("/category", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.createCategory);
router.get("/category", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.getAllCategories);
router.get("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.getCategoryById);
router.put("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.updateCategory);
router.delete("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.deleteCategory);
// pin routes
router.post("/pin", requireAuth_1.verifyToken, pin_controller_1.pinController.createPin);
router.get("/pin", requireAuth_1.verifyToken, pin_controller_1.pinController.getAllPins);
router.get("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.getPinById);
router.put("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.updatePin);
router.delete("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.deletePin);
router.post("/pin/buy/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.buyPin);
router.post("/pin/topic/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinTopic);
router.post("/pin/comment/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinComment);
router.post("/pin/auction/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinAuction);
router.post("/pin/auctionBid/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinAuctionBid);
exports.shopRouter = router;
