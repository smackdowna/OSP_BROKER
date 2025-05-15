"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const forum_routes_1 = require("../modules/forum/forum.routes");
const membership_routes_1 = require("../modules/membership/membership.routes");
const business_routes_1 = require("../modules/business/business.routes");
const admin_router_1 = require("../modules/admin/admin.router");
const moderator_router_1 = require("../modules/moderator/moderator.router");
const flagContent_router_1 = require("../modules/flagContent/flagContent.router");
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
    },
    {
        path: "/business",
        route: business_routes_1.businessRouter
    },
    {
        path: "/admin",
        route: admin_router_1.adminRouter
    },
    {
        path: "/moderator",
        route: moderator_router_1.moderatorRouter
    },
    {
        path: "/flag",
        route: flagContent_router_1.flagContentRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
