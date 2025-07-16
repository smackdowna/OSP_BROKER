"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const post_controller_1 = require("./post.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = (0, express_1.Router)();
// Post routes
router.post("/", requireAuth_1.verifyToken, multer_1.default.multipleUpload, post_controller_1.postController.createPost);
router.get("/", (0, authorizeRole_1.authorizeRole)("ADMIN"), post_controller_1.postController.getAllPosts);
router.get("/business/:businessId", post_controller_1.postController.getPostsByBusinessId);
router.get("/:id", post_controller_1.postController.getPostById);
router.put("/:id", requireAuth_1.verifyToken, multer_1.default.multipleUpload, post_controller_1.postController.updatePost);
router.delete("/:id", requireAuth_1.verifyToken, post_controller_1.postController.deletePost);
router.post("/share/:postId", requireAuth_1.verifyToken, post_controller_1.postController.sharePost);
router.delete("/unshare/:postId", requireAuth_1.verifyToken, post_controller_1.postController.unsharePost);
router.get("/sharedPosts/:userId", requireAuth_1.verifyToken, post_controller_1.postController.getSharedPostsByUserId);
exports.postRoutes = router;
