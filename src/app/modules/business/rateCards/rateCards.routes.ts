import { businessRateCardController } from "./rateCards.controller";
import { businessRateCardCategoryController } from "./rateCardCategory/rateCardCategory.controller";
import { businessRateCardItemController } from "./rateCardItem/rateCardItem.controller";
import { Router } from "express";
import { verifyToken } from "../../../middlewares/requireAuth";
import { authorizeRole } from "../../../middlewares/authorizeRole";
import { verifyMembership } from "../../../middlewares/authorizeMembership";
import { multipleUpload } from "../../../middlewares/multer";

const router = Router();

// Business Rate Card Item routes
router.post("/item/:businessRateCardId", verifyToken, authorizeRole("ADMIN"), businessRateCardItemController.createBusinessRateCardItem);
router.get("/item",verifyToken , authorizeRole("ADMIN"),  businessRateCardItemController.getAllBusinessRateCardItems);
router.get("/itemById/:id", businessRateCardItemController.getBusinessRateCardItemById);
router.get("/item/:businessRateCardId", businessRateCardItemController.getBusinessRateCardItemByRateCardId);
router.get("/item/category/:businessRateCardId/:businessRateCardCategoryId", businessRateCardItemController.getBussinessRateCardItemsForRateCardByRateCardCategory);
router.put("/item/:id", verifyToken, authorizeRole("ADMIN"), businessRateCardItemController.updateBusinessRateCardItem);
router.delete("/item/:id", verifyToken, authorizeRole("ADMIN"), businessRateCardItemController.deleteBusinessRateCardItem);

// business rate card category routes
router.post("/category", verifyToken, authorizeRole("ADMIN"), businessRateCardCategoryController.createBusinessRateCardCategory);
router.get("/category", businessRateCardCategoryController.getAllBusinessRateCardCategories);
router.get("/category/:id", businessRateCardCategoryController.getBusinessRateCardCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), businessRateCardCategoryController.updateBusinessRateCardCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), businessRateCardCategoryController.deleteBusinessRateCardCategory);


// Business Rate Card routes
router.post("/" , verifyToken, authorizeRole("ADMIN"),multipleUpload, businessRateCardController.createBusinessRateCard);
router.get("/", verifyToken,verifyMembership,authorizeRole("ADMIN"), businessRateCardController.getAllBusinessRateCards);
router.get("/business/:businessId", businessRateCardController.getBusinessRateCardByBusinessId);
router.get("/:id", verifyToken,authorizeRole("ADMIN") ,  businessRateCardController.getBusinessRateCardById);
router.put("/:id", verifyToken, authorizeRole("ADMIN"),multipleUpload, businessRateCardController.updateBusinessRateCard);
router.delete("/:id", verifyToken, authorizeRole("ADMIN"), businessRateCardController.deleteBusinessRateCard);


export const businessRateCardRouter = router;