"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionRouter = void 0;
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const category_controller_1 = require("./category/category.controller");
const auction_controller_1 = require("./auction/auction.controller");
const bid_controller_1 = require("./bid/bid.controller");
const multer_1 = require("../../middlewares/multer");
const router = (0, express_1.Router)();
// bid routes
router.post("/bid/:auctionId", requireAuth_1.verifyToken, bid_controller_1.bidController.createBid);
router.get("/bid", bid_controller_1.bidController.getAllBids);
router.get("/bid/auctionId/:auctionId", bid_controller_1.bidController.getBidsByAuctionId);
router.get("/bid/:id", bid_controller_1.bidController.getBidById);
router.put("/bid/:id", requireAuth_1.verifyToken, bid_controller_1.bidController.updateBid);
router.post("/bid/softDelete/:id", requireAuth_1.verifyToken, bid_controller_1.bidController.softDeleteAuctionBid);
router.delete("/bid/:id", requireAuth_1.verifyToken, bid_controller_1.bidController.deleteBid);
// Auction Category routes
router.post("/category", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.createAuctionCategory);
router.get("/category", category_controller_1.categoryController.getAllAuctionCategories);
router.get("/category/:id", category_controller_1.categoryController.getAuctionsByCategoryById);
router.put("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.updateAuctionCategory);
router.post("/category/softDelete/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.softDeleteAuctionCategory);
router.delete("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), category_controller_1.categoryController.deleteAuctionCategory);
// Auction routes
router.post("/", requireAuth_1.verifyToken, multer_1.multipleUpload, auction_controller_1.auctionController.createAuction);
router.get("/", auction_controller_1.auctionController.getAllAuctions);
router.get("/:id", auction_controller_1.auctionController.getAuctionById);
router.put("/:id", requireAuth_1.verifyToken, multer_1.multipleUpload, auction_controller_1.auctionController.updateAuction);
router.post("/softDelete/:id", requireAuth_1.verifyToken, auction_controller_1.auctionController.softDeleteAuction);
router.delete("/:id", requireAuth_1.verifyToken, auction_controller_1.auctionController.deleteAuction);
exports.auctionRouter = router;
