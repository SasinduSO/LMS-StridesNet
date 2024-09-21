
require('dotenv').config();


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key
const paymentModel = require("../models/payment");
const courseModel = require("../models/courseModel");

const PaymentController = {
  // Create Payment Intent and handle payment
  createPaymentIntent: async (req, res) => {
    const { amount } = req.body;

    try {
      // Create a PaymentIntent with the provided amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe processes amounts in cents
        currency: 'usd',
      });

      // Send the client secret to the frontend to complete payment
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send({ error: error.message });
    }
  },

  helloPayment: (req, res) => {
    res.status(200).send("Hello from payment");
  },

  async getCourseDetails(req, res) {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: 'Course code is required' });
    }

    try {
      const course = await courseModel.getCourseByCode(code);

      if (course.length > 0) {
        res.status(200).json(course[0]); // Return the first course found
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  // Add payment record to the database once the payment is successful
  addPayment: async (req, res) => {
    const { studentId, courseId, amount } = req.body;

    const paymentData = {
      student_id: studentId,
      course_id: courseId,
      amount,
      payment_date: new Date(),
      payment_status: 'Completed', // Set to 'Completed' if payment was successful
    };

    try {
      await paymentModel.addPayment(paymentData);
      res.status(201).json({ message: "Payment added successfully" });
    } catch (err) {
      console.error("Error adding payment:", err);
      res.status(500).json({ error: "Failed to add payment" });
    }
  },

  // Check payment status of a student for a specific course
  checkPaymentStatus: async (req, res) => {
    const { studentId, courseId } = req.params;
    try {
      const payment = await paymentModel.getPaymentStatus(studentId, courseId);
      if (payment) {
        res.status(200).json({ paid: true, payment });
      } else {
        res.status(200).json({ paid: false });
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      res.status(500).json({ error: "Failed to check payment status" });
    }
  },

  // Get total monthly revenue
  getMonthlyRevenue: async (req, res) => {
    try {
      const totalRevenue = await paymentModel.getMonthlyRevenue();
      res.status(200).json({ totalRevenue });
    } catch (err) {
      console.error("Error retrieving monthly revenue:", err);
      res.status(500).json({ error: "Failed to retrieve revenue" });
    }
  },
};


module.exports = PaymentController;
