import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { forumRouter } from "../modules/forum/forum.routes";
import { membershipRouter } from "../modules/membership/membership.routes";
import { businessRouter } from "../modules/business/business.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { moderatorRouter } from "../modules/moderator/moderator.routes";
import { flagContentRouter } from "../modules/flagContent/flagContent.routes";
import { userRoute } from "../modules/user/user.routes";
import { followRouter } from "../modules/follow/follow.routes";
import { announcementRouter } from "../modules/announcemnet/announcement.routes";
import { pollRouter } from "../modules/poll/poll.routes";
import { eventRouter } from "../modules/events/event.routes";
import { chatRouter } from "../modules/chat/chat.routes";
import { reactionsRouter } from "../modules/Reactions/reactions.routes";
import { groupChatRouter } from "../modules/chat/groupChat/groupChat.routes";
import { liveConventionRoutes } from "../modules/liveConvention/liveConvention.routes";
import { bookingRouter } from "../modules/booking/booking.routes";

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
    },
    {
        path : "/groupChat",
        route: groupChatRouter
    },
    {
        path: "/reactions",
        route: reactionsRouter
    },
    {
        path: "/liveConvention",
        route: liveConventionRoutes
    }, 
    { 
        path: "/booking",
        route: bookingRouter
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;