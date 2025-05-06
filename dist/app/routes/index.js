"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const forum_routes_1 = require("../modules/forum/forum.routes");
const membership_routes_1 = require("../modules/membership/membership.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter
    },
    {
        path: "/forum",
        route: forum_routes_1.forumRouter
    },
    {
        path: "/membership",
        route: membership_routes_1.membershipRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
