import { postController } from "./post.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { multipleUpload } from "../../middlewares/multer";

const router = Router();


// Post routes
router.post("/", verifyToken,multipleUpload ,  postController.createPost);
router.get("/",verifyToken, authorizeRole("ADMIN"), postController.getAllPosts);
router.get("/business/:businessId", postController.getPostsByBusinessId);
router.get("/sharedPosts", verifyToken, postController.getSharedPostsByUserId);
router.get("/:id", postController.getPostById);
router.put("/:id", verifyToken,multipleUpload, postController.updatePost);
router.delete("/:id", verifyToken, postController.deletePost);

router.post("/share/:postId", verifyToken, postController.sharePost);
router.delete("/unshare/:postId", verifyToken, postController.unsharePost);

export const postRoutes = router;