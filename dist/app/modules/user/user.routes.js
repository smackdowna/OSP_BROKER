"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const userProfile_controller_1 = require("./userProfile/userProfile.controller");
const user_controller_1 = require("./user.controller");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const router = express_1.default.Router();
// User profile routes
router.post("/userProfile/:userId", requireAuth_1.verifyToken, userProfile_controller_1.userProfileController.createUserProfile);
router.get("/userProfile/:userId", requireAuth_1.verifyToken, userProfile_controller_1.userProfileController.getUserProfileByUserId);
router.get("/userProfiles", requireAuth_1.verifyToken, userProfile_controller_1.userProfileController.getAllUserProfiles);
router.put("/userProfile/:userId", requireAuth_1.verifyToken, userProfile_controller_1.userProfileController.updateUserProfile);
router.delete("/userProfile/:userId", requireAuth_1.verifyToken, userProfile_controller_1.userProfileController.deleteUserProfile);
// User routes
router.get("/", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), user_controller_1.userController.getAllUsers);
router.get("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), user_controller_1.userController.getUserById);
router.delete("/:id", requireAuth_1.verifyToken, (0, authorizeRole_1.authorizeRole)("ADMIN"), user_controller_1.userController.deleteUser);
exports.userRoute = router;
