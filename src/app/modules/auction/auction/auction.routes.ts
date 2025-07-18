import { Router } from "express";
import { verifyToken } from "../../../middlewares/requireAuth";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { categoryController } from "../category/category.controller";
import { auctionController } from "./auction.controller";
import { multipleUpload } from "../../../middlewares/multer";

const router = Router();


// Auction Category routes
router.post("/category", verifyToken, authorizeRole("ADMIN"), categoryController.createAuctionCategory);
router.get("/category", categoryController.getAllAuctionCategories);
router.get("/category/:id", categoryController.getAuctionsByCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.updateAuctionCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.deleteAuctionCategory);

// Auction routes
router.post("/", verifyToken,multipleUpload,  auctionController.createAuction);
router.get("/", auctionController.getAllAuctions);
router.get("/:id", auctionController.getAuctionById);
router.put("/:id", verifyToken,multipleUpload,  auctionController.updateAuction);
router.delete("/:id", verifyToken,  auctionController.deleteAuction);



export const auctionRouter = router;