"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRouter = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category/category.controller");
const kudoCoin_controller_1 = require("./kudoCoin/kudoCoin.controller");
const badge_controller_1 = require("./badge/badge.controller");
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
router.post("/pin", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), pin_controller_1.pinController.createPin);
router.get("/pin", requireAuth_1.verifyToken, pin_controller_1.pinController.getAllPins);
router.get("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.getPinById);
router.put("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.updatePin);
router.delete("/pin/:id", requireAuth_1.verifyToken, pin_controller_1.pinController.deletePin);
router.post("/pin/buy/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.buyPin);
router.post("/pin/topic/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinTopic);
router.post("/pin/comment/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinComment);
router.post("/pin/auction/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinAuction);
router.post("/pin/auctionBid/:pinId", requireAuth_1.verifyToken, pin_controller_1.pinController.pinAuctionBid);
router.get("/userPins", requireAuth_1.verifyToken, pin_controller_1.pinController.getUserPinsByUserId);
// kudoCoin routes
router.post("/kudoCoin", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), kudoCoin_controller_1.kudoCoinController.createKudoCoin);
router.get("/kudoCoin", requireAuth_1.verifyToken, kudoCoin_controller_1.kudoCoinController.getAllKudoCoins);
router.get("/kudoCoin/:id", requireAuth_1.verifyToken, kudoCoin_controller_1.kudoCoinController.getKudoCoinById);
router.put("/kudoCoin/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), kudoCoin_controller_1.kudoCoinController.updateKudoCoin);
router.delete("/kudoCoin/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), kudoCoin_controller_1.kudoCoinController.deleteKudoCoin);
router.post("/kudoCoin/buy/:id", requireAuth_1.verifyToken, kudoCoin_controller_1.kudoCoinController.buyKudoCoin);
// badge routes
router.post("/badge", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), badge_controller_1.badgeController.createBadge);
router.get("/badge", requireAuth_1.verifyToken, badge_controller_1.badgeController.getAllBadges);
router.get("/badge/:id", requireAuth_1.verifyToken, badge_controller_1.badgeController.getBadgeById);
router.put("/badge/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), badge_controller_1.badgeController.updateBadge);
router.delete("/badge/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), badge_controller_1.badgeController.deleteBadge);
router.post("/badge/buy/:badgeId", requireAuth_1.verifyToken, badge_controller_1.badgeController.buyBadge);
exports.shopRouter = router;
