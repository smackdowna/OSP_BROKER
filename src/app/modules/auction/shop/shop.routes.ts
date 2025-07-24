import { Router } from "express";
import { categoryController } from "./category/category.controller";
import { verifyToken } from "../../../middlewares/requireAuth";
import { authorizeRole } from "../../../middlewares/authorizeRole";

const router= Router();

// category rouets
router.post("/category/", verifyToken, authorizeRole("ADMIN"), categoryController.createCategory);
router.get("/category/", verifyToken, authorizeRole("ADMIN"), categoryController.getAllCategories);
router.get("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.getCategoryById);
router.put("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.updateCategory);
router.delete("/category/:id", verifyToken, authorizeRole("ADMIN"), categoryController.deleteCategory);


export const shopRouter = router;