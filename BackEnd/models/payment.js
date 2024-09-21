const connection = require("../models/connection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

class PaymentModel {
  // Record a payment
  async addPayment(paymentData) {
    try {
      const queryString = `INSERT INTO student_payments SET ?`; // Updated to match the table name 'student_payments'
      const result = await query(queryString, paymentData);
      return result;
    } catch (err) {
      throw new Error("Failed to add payment");
    }
  }

  // Get payment status by student ID and course ID
  async getPaymentStatus(studentId, courseId) {
    try {
      const queryString = `
        SELECT * FROM student_payments 
        WHERE student_id = ? 
        AND course_id = ? 
        AND MONTH(payment_date) = MONTH(CURDATE()) 
        AND YEAR(payment_date) = YEAR(CURDATE())`; // Updated to also check the year to match the current month and year
      const result = await query(queryString, [studentId, courseId]);
      return result.length > 0 ? result[0] : null;
    } catch (err) {
      throw new Error("Failed to retrieve payment status");
    }
  }

  // Update payment for a student
  async updatePayment(paymentId, paymentData) {
    try {
      const queryString = `UPDATE student_payments SET ? WHERE id = ?`; // Updated to match the table name 'student_payments'
      const result = await query(queryString, [paymentData, paymentId]);
      return result;
    } catch (err) {
      throw new Error("Failed to update payment");
    }
  }

  // Track monthly revenue
  async getMonthlyRevenue() {
    try {
      const queryString = `
        SELECT SUM(amount) AS total_revenue 
        FROM student_payments 
        WHERE MONTH(payment_date) = MONTH(CURDATE()) 
        AND YEAR(payment_date) = YEAR(CURDATE())`; // Updated to also check the year to match the current month and year
      const result = await query(queryString);
      return result[0].total_revenue;
    } catch (err) {
      throw new Error("Failed to retrieve revenue");
    }
  }
}

const paymentModel = new PaymentModel();
module.exports = paymentModel;
