const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const studentAuth = require("../middleware/studentAuth");

// Route to create Stripe PaymentIntent
router.post("/create-payment-intent", paymentController.createPaymentIntent);

router.get("/working-route", paymentController.helloPayment);

// Route to handle payment addition after successful payment
router.post("/pay-course", paymentController.addPayment);

// Check if the student has paid for the course
router.get("/check-payment-status/:studentId/:courseId", studentAuth, paymentController.checkPaymentStatus);

// Get total monthly revenue
router.get("/monthly-revenue", paymentController.getMonthlyRevenue);

router.get('/course/:code', paymentController.getCourseDetails);



module.exports = router;

