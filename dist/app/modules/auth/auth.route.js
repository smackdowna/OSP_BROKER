"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.authControllers.createUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.LoginValidationSchema), auth_controller_1.authControllers.loginUser);
router.post("/refreshToken", (0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.authControllers.refreshToken);
router.get("/getAllUsers", auth_controller_1.authControllers.getAllUsers);
router.get("/getSingleUser/:id", auth_controller_1.authControllers.getSingleUser);
exports.authRouter = router;
