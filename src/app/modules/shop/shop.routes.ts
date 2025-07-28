import { Router } from "express";
import { categoryController } from "./category/category.controller";
import { pinController } from "./pin/pin.controller";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router= Router();

// category rouets
router.post("/category", verifyToken, authorizeRole("ADMIN"), categoryController.createCategory);
router.get("/category", verifyToken, authorizeRole("ADMIN"), categoryController.getAllCategories);
router.get("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.getCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.updateCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.deleteCategory);


// pin routes
router.post("/pin", verifyToken, pinController.createPin);
router.get("/pin", verifyToken,  pinController.getAllPins);
router.get("/pin/:id", verifyToken,  pinController.getPinById);
router.put("/pin/:id", verifyToken,  pinController.updatePin);
router.delete("/pin/:id", verifyToken,  pinController.deletePin);
router.post("/pin/buy/:pinId", verifyToken, pinController.buyPin);
router.post("/pin/topic/:pinId", verifyToken, pinController.pinTopic);
router.post("/pin/comment/:pinId", verifyToken, pinController.pinComment);
router.post("/pin/auction/:pinId", verifyToken, pinController.pinAuction);
router.post("/pin/auctionBid/:pinId", verifyToken, pinController.pinAuctionBid);


export const shopRouter = router;