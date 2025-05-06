import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { forumRouter } from "../modules/forum/forum.routes";
import { membershipRouter } from "../modules/membership/membership.routes";

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
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;