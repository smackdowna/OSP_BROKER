"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveConventionRoutes = void 0;
const express_1 = require("express");
const liveConvention_controller_1 = require("./liveConvention.controller");
const router = (0, express_1.Router)();
// Route to create a signature
router.post("/createSignature", liveConvention_controller_1.liveConventionController.createSignature);
router.post("/notifyLiveConvention/:businessId", liveConvention_controller_1.liveConventionController.notifyLiveConvention);
exports.liveConventionRoutes = router;
