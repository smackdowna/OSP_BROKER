import { Router } from "express";
import { categoryController } from "./category/category.controller";
import { kudoCoinController } from "./kudoCoin/kudoCoin.controller";
import { badgeController } from "./badge/badge.controller";
import { pinController } from "./pin/pin.controller";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router= Router();

// category rouets
router.post("/category", verifyToken, authorizeRole("ADMIN"), categoryController.createCategory);
router.get("/category", verifyToken, authorizeRole("ADMIN"), categoryController.getAllCategories);
router.get("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.getCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.updateCategory);
router.post("/category/softDelete/:id", verifyToken, authorizeRole("ADMIN"), categoryController.softDeleteShopCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.deleteCategory);


// pin routes
router.post("/pin", verifyToken,authorizeRole("ADMIN"), pinController.createPin);
router.get("/pin", verifyToken,  pinController.getAllPins);
router.get("/pin/:id", verifyToken,  pinController.getPinById);
router.put("/pin/:id", verifyToken,  pinController.updatePin);
router.post("/pin/softDelete/:id", verifyToken,  pinController.softDeletePin);
router.delete("/pin/:id", verifyToken,  pinController.deletePin);
router.post("/pin/buy/:pinId", verifyToken, pinController.buyPin);
router.post("/pin/topic/:pinId", verifyToken, pinController.pinTopic);
router.post("/pin/comment/:pinId", verifyToken, pinController.pinComment);
router.post("/pin/auction/:pinId", verifyToken, pinController.pinAuction);
router.post("/pin/auctionBid/:pinId", verifyToken, pinController.pinAuctionBid);
router.get("/userPins", verifyToken, pinController.getUserPinsByUserId);

// kudoCoin routes
router.post("/kudoCoin", verifyToken, authorizeRole("ADMIN"), kudoCoinController.createKudoCoin);
router.get("/kudoCoin", verifyToken, kudoCoinController.getAllKudoCoins);
router.get("/kudoCoin/:id", verifyToken, kudoCoinController.getKudoCoinById);
router.put("/kudoCoin/:id", verifyToken, authorizeRole("ADMIN"), kudoCoinController.updateKudoCoin);
router.post("/kudoCoin/softDelete/:id", verifyToken, authorizeRole("ADMIN"), kudoCoinController.softDeleteKudoCoin);
router.delete("/kudoCoin/:id", verifyToken, authorizeRole("ADMIN"), kudoCoinController.deleteKudoCoin);
router.post("/kudoCoin/buy/:id", verifyToken, kudoCoinController.buyKudoCoin);


// badge routes
router.post("/badge", verifyToken, authorizeRole("ADMIN"), badgeController.createBadge);
router.get("/badge", verifyToken, badgeController.getAllBadges);
router.get("/badge/:id", verifyToken, badgeController.getBadgeById);
router.put("/badge/:id", verifyToken, authorizeRole("ADMIN"), badgeController.updateBadge);
router.post("/badge/softDelete/:id", verifyToken, authorizeRole("ADMIN"), badgeController.softDeleteBadge);
router.delete("/badge/:id", verifyToken, authorizeRole("ADMIN"), badgeController.deleteBadge);
router.post("/badge/buy/:badgeId", verifyToken, badgeController.buyBadge);

export const shopRouter = router;