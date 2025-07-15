"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const booking_controller_1 = require("./booking.controller");
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const authorizeRole_1 = require("../../middlewares/authorizeRole");
const authorizeMembership_1 = require("../../middlewares/authorizeMembership");
const router = (0, express_1.Router)();
// Booking routes
router.post('/', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("REPRESENTATIVE"), booking_controller_1.bookingController.createBooking);
router.get('/', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("REPRESENTATIVE"), booking_controller_1.bookingController.getNotBookedBookings);
router.put('/:bookingId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("REPRESENTATIVE"), booking_controller_1.bookingController.updateBooking);
router.post('/book/:bookingId', requireAuth_1.verifyToken, booking_controller_1.bookingController.book);
router.delete('/:bookingId', requireAuth_1.verifyToken, authorizeMembership_1.verifyMembership, (0, authorizeRole_1.authorizeRole)("REPRESENTATIVE"), booking_controller_1.bookingController.deleteBooking);
exports.bookingRouter = router;
