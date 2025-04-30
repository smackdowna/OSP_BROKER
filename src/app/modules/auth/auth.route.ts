import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import {authControllers} from "./auth.controller";

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

router.get(
    "/getAllUsers",
    authControllers.getAllUsers
)

router.get(
    "/getSingleUser/:id",
    authControllers.getSingleUser
)

export const authRouter = router;