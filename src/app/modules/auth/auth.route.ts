import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import {authControllers} from "./auth.controllers";

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
    "/refresh-token",
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    authControllers.refreshToken
);

export const authRouter = router;