import { postController } from "./post.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";
import multer from "../../middlewares/multer";

const router = Router();


// Post routes
router.post("/", verifyToken,multer.multipleUpload,  postController.createPost);
router.get("/", authorizeRole("ADMIN"), postController.getAllPosts);
router.get("/business/:businessId", postController.getPostsByBusinessId);
router.get("/:id", postController.getPostById);
router.put("/:id", verifyToken,multer.multipleUpload, postController.updatePost);
router.delete("/:id", verifyToken, postController.deletePost);

router.post("/share/:postId", verifyToken, postController.sharePost);
router.delete("/unshare/:postId", verifyToken, postController.unsharePost);
router.get("/sharedPosts/:userId", verifyToken, postController.getSharedPostsByUserId);

export const postRoutes = router;