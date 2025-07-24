"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const forum_routes_1 = require("../modules/forum/forum.routes");
const membership_routes_1 = require("../modules/membership/membership.routes");
const business_routes_1 = require("../modules/business/business.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const moderator_routes_1 = require("../modules/moderator/moderator.routes");
const flagContent_routes_1 = require("../modules/flagContent/flagContent.routes");
const user_routes_1 = require("../modules/user/user.routes");
const follow_routes_1 = require("../modules/follow/follow.routes");
const announcement_routes_1 = require("../modules/announcemnet/announcement.routes");
const poll_routes_1 = require("../modules/poll/poll.routes");
const event_routes_1 = require("../modules/events/event.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const reactions_routes_1 = require("../modules/Reactions/reactions.routes");
const groupChat_routes_1 = require("../modules/chat/groupChat/groupChat.routes");
const liveConvention_routes_1 = require("../modules/liveConvention/liveConvention.routes");
const booking_routes_1 = require("../modules/booking/booking.routes");
const post_routes_1 = require("../modules/post/post.routes");
const auction_routes_1 = require("../modules/auction/auction/auction.routes");
const shop_routes_1 = require("../modules/auction/shop/shop.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRouter
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
        route: admin_routes_1.adminRouter
    },
    {
        path: "/moderator",
        route: moderator_routes_1.moderatorRouter
    },
    {
        path: "/flag",
        route: flagContent_routes_1.flagContentRouter
    },
    {
        path: "/user",
        route: user_routes_1.userRoute
    },
    {
        path: "/follow",
        route: follow_routes_1.followRouter
    },
    {
        path: "/announcement",
        route: announcement_routes_1.announcementRouter
    },
    {
        path: "/poll",
        route: poll_routes_1.pollRouter
    },
    {
        path: "/event",
        route: event_routes_1.eventRouter
    },
    {
        path: "/chat",
        route: chat_routes_1.chatRouter
    },
    {
        path: "/groupChat",
        route: groupChat_routes_1.groupChatRouter
    },
    {
        path: "/reactions",
        route: reactions_routes_1.reactionsRouter
    },
    {
        path: "/liveConvention",
        route: liveConvention_routes_1.liveConventionRoutes
    },
    {
        path: "/booking",
        route: booking_routes_1.bookingRouter
    },
    {
        path: "/post",
        route: post_routes_1.postRoutes
    },
    {
        path: "/auction",
        route: auction_routes_1.auctionRouter
    },
    {
        path: "/shop",
        route: shop_routes_1.shopRouter
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
