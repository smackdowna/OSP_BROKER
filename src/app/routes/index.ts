import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { forumRouter } from "../modules/forum/forum.routes";
import { membershipRouter } from "../modules/membership/membership.routes";
import { businessRouter } from "../modules/business/business.routes";
import { adminRouter } from "../modules/admin/admin.router";
import { moderatorRouter } from "../modules/moderator/moderator.router";
import { flagContentRouter } from "../modules/flagContent/flagContent.router";
import { userRoute } from "../modules/user/user.routes";
import { followRouter } from "../modules/follow/follow.routes";
import { announcementRouter } from "../modules/forum/announcemnet/announcement.routes";
import { pollRouter } from "../modules/forum/poll/poll.routes";
import { eventRouter } from "../modules/forum/events/event.routes";
import { chatRouter } from "../modules/chat/chat.routes";

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
    },
    {
        path: "/moderator",
        route: moderatorRouter
    },
    {
        path:"/flag",
        route: flagContentRouter
    },
    {
        path: "/user",
        route: userRoute
    },
    {
        path: "/follow",
        route: followRouter
    },
    {
        path: "/announcement",
        route: announcementRouter
    },
    {
        path: "/poll",
        route: pollRouter
    },
    {
        path: "/event",
        route: eventRouter
    },
    {
        path: "/chat",
        route: chatRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;