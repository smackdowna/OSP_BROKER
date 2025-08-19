"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = __importDefault(require("../../errors/appError"));
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const oAuth_config_1 = __importDefault(require("../../config/oAuth.config"));
const axios_1 = __importDefault(require("axios"));
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const prismaDb_1 = __importDefault(require("../../db/prismaDb"));
const config_1 = __importDefault(require("../../config"));
const zod_1 = __importDefault(require("zod"));
const emailSchema = zod_1.default.string().email();
// create user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role, phone, userProfile, representative, businessAdmin, moderator, admin } = payload;
    if (!fullName || !email || !password || !role || !phone) {
        throw new appError_1.default(400, "please provide all fields");
    }
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
        throw new appError_1.default(400, "Invalid email format");
    }
    const existingUser = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (existingUser) {
        throw new appError_1.default(400, "User already exists with this email");
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    // Define mapping from role to relation name
    const roleToRelation = {
        USER: 'userProfile',
        REPRESENTATIVE: 'representative',
        BUSINESS_ADMIN: 'businessAdmin',
        MODERATOR: 'moderator',
        ADMIN: 'admin',
    };
    // Set dynamic include option based on the role
    const relationName = roleToRelation[role];
    let includeOption = {};
    if (relationName === "representative") {
        includeOption = {
            representative: true,
            userProfile: true
        };
    }
    else {
        includeOption = relationName ? {
            [relationName]: true
        } : {};
    }
    const user = yield prismaDb_1.default.user.create({
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ fullName,
            email, password: hashedPassword, role,
            phone }, (role === 'USER' && userProfile ? {
            userProfile: {
                create: {
                    headLine: userProfile.headLine,
                    location: userProfile.location,
                    about: userProfile.about,
                    profileImageUrl: userProfile.profileImageUrl,
                    skills: userProfile.skills,
                    socialLinks: userProfile.socialLinks,
                    education: userProfile.education ? { create: userProfile.education } : undefined,
                    experience: userProfile.experience ? { create: userProfile.experience } : undefined,
                },
            },
        } : {})), (role === 'REPRESENTATIVE' && representative ? {
            representative: {
                create: representative,
            },
        } : {})), (role === 'BUSINESS_ADMIN' && businessAdmin ? {
            businessAdmin: {
                create: businessAdmin,
            },
        } : {})), (role === 'MODERATOR' && moderator ? {
            moderator: {
                create: moderator,
            },
        } : {})), (role === 'ADMIN' && admin ? {
            admin: {
                create: admin,
            },
        } : {})),
        include: includeOption,
    });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
// login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!email || !password) {
        throw new appError_1.default(400, "Please provide all fields");
    }
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "user not found");
    }
    if (user.isBanned) {
        throw new appError_1.default(401, "You are temporarily banned from this platform");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(401, "Invalid credentials");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone
        },
    };
});
// refresh token service to get new access token using refresh token
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new appError_1.default(401, "Please provide refresh token");
    }
    const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new appError_1.default(401, "user not found");
    }
    const jwtPayload = {
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
// get all users
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaDb_1.default.user.findMany();
    if (!users || users.length === 0) {
        throw new appError_1.default(404, "No users found");
    }
    return users.map((user) => {
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    });
});
// get user by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaDb_1.default.user.findFirst({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
// google authentication
const googleSignIn = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code) {
        throw new appError_1.default(400, "Please provide code");
    }
    console.log("This is code", code);
    const { tokens } = yield oAuth_config_1.default.getToken({
        code,
        redirect_uri: config_1.default.google_redirect_uri
    });
    oAuth_config_1.default.setCredentials(tokens);
    const userRes = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
    console.log("This is userRes", userRes);
    if (!userRes) {
        throw new appError_1.default(400, "Unable to fetch user data from google");
    }
    // check existing user
    let user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: userRes.data.email
        }
    });
    if (!user) {
        user = yield prismaDb_1.default.user.create({
            data: {
                fullName: userRes.data.name,
                email: userRes.data.email,
                password: "",
                role: "USER",
                phone: "",
                userProfile: {
                    create: {
                        headLine: "",
                        location: "",
                        about: "",
                        profileImageUrl: userRes.data.picture,
                        skills: [],
                        socialLinks: [],
                        education: {
                            create: []
                        },
                        experience: {
                            create: []
                        }
                    }
                }
            }
        });
    }
    const accessToken = (0, auth_utils_1.createToken)({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user
    };
});
const appleSignIn = (id_token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id_token) {
        throw new appError_1.default(400, "Please provide code");
    }
    const userData = yield apple_signin_auth_1.default.verifyIdToken(id_token, {
        audience: config_1.default.apple_client_id,
        ignoreExpiration: true,
    });
    if (!userData || !userData.email) {
        throw new appError_1.default(400, "Unable to fetch user data from apple");
    }
    console.log("This is userData", userData);
    const email = userData.email;
    let user = yield prismaDb_1.default.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user) {
        user = yield prismaDb_1.default.user.create({
            data: {
                fullName: "apple user",
                email: userData.email,
                password: "",
                role: "USER",
                phone: "",
                userProfile: {
                    create: {
                        headLine: "",
                        location: "",
                        about: "",
                        profileImageUrl: "",
                        skills: [],
                        socialLinks: [],
                        education: {
                            create: []
                        },
                        experience: {
                            create: []
                        }
                    }
                }
            }
        });
    }
    const accessToken = (0, auth_utils_1.createToken)({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user
    };
});
exports.authServices = {
    createUser,
    loginUser,
    refreshToken,
    getUsers,
    getUserById,
    googleSignIn,
    appleSignIn
};
