import express from "express";
import { userProfileController } from "./userProfile/userProfile.controller";
import { userController } from "./user.controller";

import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";


const router = express.Router();

// User profile routes
router.post("/userProfile/:userId", verifyToken, userProfileController.createUserProfile);
router.get("/userProfile/:userId", verifyToken, userProfileController.getUserProfileByUserId);
router.get("/userProfiles", verifyToken,authorizeRole("ADMIN"), userProfileController.getAllUserProfiles);
router.put("/userProfile/:userId", verifyToken, userProfileController.updateUserProfile);
router.delete("/userProfile/:userId", verifyToken, userProfileController.deleteUserProfile);


// User routes
router.get("/", verifyToken, authorizeRole("ADMIN"), userController.getAllUsers);
router.get("/:id", verifyToken, authorizeRole("ADMIN"), userController.getUserById);
router.post("/softDelete/:id", verifyToken, userController.softDeleteUser);
router.delete("/:id", verifyToken, authorizeRole("ADMIN"), userController.deleteUser);


export const userRoute = router;