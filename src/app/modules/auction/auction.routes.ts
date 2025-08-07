import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { categoryController } from "./category/category.controller";
import { auctionController } from "./auction/auction.controller";
import { bidController } from "./bid/bid.controller";
import { multipleUpload } from "../../middlewares/multer";

const router = Router();

// bid routes
router.post("/bid/:auctionId", verifyToken, bidController.createBid);
router.get("/bid", bidController.getAllBids);
router.get("/bid/auctionId/:auctionId", bidController.getBidsByAuctionId);
router.get("/bid/:id", bidController.getBidById);
router.put("/bid/:id", verifyToken, bidController.updateBid);
router.post("/bid/softDelete/:id", verifyToken, bidController.softDeleteAuctionBid);
router.delete("/bid/:id", verifyToken, bidController.deleteBid);


// Auction Category routes
router.post("/category", verifyToken, authorizeRole("ADMIN"), categoryController.createAuctionCategory);
router.get("/category", categoryController.getAllAuctionCategories);
router.get("/category/:id", categoryController.getAuctionsByCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.updateAuctionCategory);
router.post("/category/softDelete/:id", verifyToken, authorizeRole("ADMIN"), categoryController.softDeleteAuctionCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.deleteAuctionCategory);

// Auction routes
router.post("/", verifyToken,multipleUpload,  auctionController.createAuction);
router.get("/", auctionController.getAllAuctions);
router.get("/:id", auctionController.getAuctionById);
router.put("/:id", verifyToken,multipleUpload,  auctionController.updateAuction);
router.post("/softDelete/:id", verifyToken, auctionController.softDeleteAuction);
router.delete("/:id", verifyToken,  auctionController.deleteAuction);



export const auctionRouter = router;