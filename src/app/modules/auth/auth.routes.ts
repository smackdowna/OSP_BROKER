import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import {authControllers} from "./auth.controller";
import { authorizeRole } from "../../middlewares/authorizeRole";

const router = express.Router();

router.post(
    "/signup",
    authControllers.createUser
);

router.post(
    "/login",
    validateRequest(AuthValidations.LoginValidationSchema),
    authControllers.loginUser
);

router.post(
    "/refreshToken",
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    authControllers.refreshToken
);

router.get(
    "/getAllUsers",
    authorizeRole("ADMIN"),
    authControllers.getAllUsers
)

router.get(
    "/getSingleUser/:id",
    authorizeRole("ADMIN"),
    authControllers.getSingleUser
)

router.post(
    "/google",
    authControllers.googleSignIn
)

router.post(
    "/apple",
    authControllers.appleSignIn
)

export const authRouter = router;