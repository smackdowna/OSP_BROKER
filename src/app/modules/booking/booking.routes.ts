import { bookingController } from "./booking.controller";
import { Router } from "express";
import { verifyToken } from "../../middlewares/requireAuth";
import { authorizeRole } from "../../middlewares/authorizeRole";
import { verifyMembership } from "../../middlewares/authorizeMembership";


const router = Router();

// Booking routes
router.post('/',verifyToken , verifyMembership , authorizeRole("REPRESENTATIVE") , bookingController.createBooking);
router.get('/',verifyToken , verifyMembership , authorizeRole("REPRESENTATIVE") ,  bookingController.getNotBookedBookings);
router.put('/:bookingId',verifyToken , verifyMembership , authorizeRole("REPRESENTATIVE") , bookingController.updateBooking);
router.post('/book/:bookingId',verifyToken, bookingController.book);
router.delete('/:bookingId',verifyToken , verifyMembership , authorizeRole("REPRESENTATIVE") , bookingController.deleteBooking);


export const bookingRouter = router;