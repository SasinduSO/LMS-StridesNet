const courseModel = require("../models/courseModel");
const studentModel = require("../models/studentModel");

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Use environment variable or a default secret key

const StudentController = {
  enrollCourse: async (req, res) => {
    try {
      const data = req.body;

      const student = await studentModel.getStudentByEmail(data.email);

      if (student.length === 0) {
        return res.status(404).json("Student Is Not Exist");
      }

      const course = await courseModel.getCourseByCode(data.code);

      if (course.length === 0) {
        return res.status(404).json("The Course Is Not Exist");
      }

      await studentModel.enrollCourse(student[0].id, course[0].id);
      res.status(200).json("Done");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  viewStudentCourses: async (req, res) => {
    try {
      const student = await studentModel.getStudentByEmail(req.headers.email);

      if (student.length === 0) {
        return res.status(404).json("Student Is Not Exist");
      }

      const studentCourses = await studentModel.getStudentCourses(
        student[0].id
      );

      if (studentCourses.length == 0)
        return res.status(200).json("No Courses Enrolled");

      res.status(200).json(studentCourses);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  viewAllCourses: async (req, res) => {
    try {
      const student = await studentModel.getStudentByEmail(req.headers.email);

      if (student.length == 0) {
        return res.status(404).json("Student Email Is Not Exist");
      }

      const courses = await studentModel.getActiveCoursesForStudent(
        student[0].id
      );

      if (courses.length == 0) return res.status(200).json("No Courses");

      res.status(200).json(courses);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  // New function to generate and send token
  generateToken: async (req, res) => {
    try {
      const { email } = req.body;
      const student = await studentModel.getStudentByEmail(email);

      if (student.length === 0) {
        return res.status(404).json('Student not found');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: student[0].id, email: student[0].email, type: 'student' },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = StudentController;
