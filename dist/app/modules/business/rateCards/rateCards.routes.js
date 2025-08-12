"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRateCardRouter = void 0;
const rateCards_controller_1 = require("./rateCards.controller");
const rateCardCategory_controller_1 = require("./rateCardCategory/rateCardCategory.controller");
const rateCardItem_controller_1 = require("./rateCardItem/rateCardItem.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../../middlewares/requireAuth");
const authorizeRole_1 = require("../../../middlewares/authorizeRole");
const authorizeMembership_1 = require("../../../middlewares/authorizeMembership");
const router = (0, express_1.Router)();
// Business Rate Card Item routes
router.post("/item/:businessRateCardId", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardItem_controller_1.businessRateCardItemController.createBusinessRateCardItem);
router.get("/item", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardItem_controller_1.businessRateCardItemController.getAllBusinessRateCardItems);
router.get("/item/:businessRateCardId", rateCardItem_controller_1.businessRateCardItemController.getBusinessRateCardItemByRateCardId);
router.get("/item/:businessRateCardId/:businessRateCardCategoryId", rateCardItem_controller_1.businessRateCardItemController.getBussinessRateCardItemsForRateCardByRateCardCategory);
router.put("/item/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardItem_controller_1.businessRateCardItemController.updateBusinessRateCardItem);
router.delete("/item/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardItem_controller_1.businessRateCardItemController.deleteBusinessRateCardItem);
// business rate card category routes
router.post("/category", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardCategory_controller_1.businessRateCardCategoryController.createBusinessRateCardCategory);
router.get("/category", rateCardCategory_controller_1.businessRateCardCategoryController.getAllBusinessRateCardCategories);
router.get("/category/:id", rateCardCategory_controller_1.businessRateCardCategoryController.getBusinessRateCardCategoryById);
router.put("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardCategory_controller_1.businessRateCardCategoryController.updateBusinessRateCardCategory);
router.delete("/category/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCardCategory_controller_1.businessRateCardCategoryController.deleteBusinessRateCardCategory);
// Business Rate Card routes
router.post("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCards_controller_1.businessRateCardController.createBusinessRateCard);
router.get("/", requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCards_controller_1.businessRateCardController.getAllBusinessRateCards);
router.get("/:businessId", rateCards_controller_1.businessRateCardController.getBusinessRateCardByBusinessId);
router.get("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCards_controller_1.businessRateCardController.getBusinessRateCardById);
router.put("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCards_controller_1.businessRateCardController.updateBusinessRateCard);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), rateCards_controller_1.businessRateCardController.deleteBusinessRateCard);
exports.businessRateCardRouter = router;
