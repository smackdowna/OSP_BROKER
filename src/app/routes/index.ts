import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { forumRouter } from "../modules/forum/forum.routes";
import { membershipRouter } from "../modules/membership/membership.routes";
import { businessRouter } from "../modules/business/business.routes";
import { adminRouter } from "../modules/admin/admin.router";

const router = Router();

const moduleRoutes=[
    {
        path:"/auth",
        route: authRouter
    },

    {
        path: "/forum",
        route: forumRouter
    } ,

    {
        path: "/membership",
        route: membershipRouter
    },
    {
        path: "/business",
        route: businessRouter
    },
    {
        path: "/admin",
        route: adminRouter
    }

]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;