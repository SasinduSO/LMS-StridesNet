const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const instructorModel = require('../models/instructorModel');
const courseModel = require('../models/courseModel');
const studentModel = require('../models/studentModel');

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Use environment variable or a default secret key

const InstructorController = {
  // Function to view courses assigned to the instructor
  viewMyCourses: async (req, res) => {
    try {
      // Retrieve instructor details using email from headers
      const instructor = await instructorModel.getInstructorByEmail(req.headers.email);

      // Check if the instructor exists
      if (instructor.length === 0) {
        return res.status(404).json('NOT EXIST');
      }

      // Get the courses assigned to the instructor
      const instructorCourses = await courseModel.getInstructorCourses(instructor[0].id);

      // Check if the instructor has any courses
      if (instructorCourses.length == 0)
        return res.status(200).json('No Courses Exist');

      // Return the list of courses
      res.status(200).json(instructorCourses);
    } catch (err) {
      // Handle any errors
      res.status(404).json(err);
    }
  },
  // Function to view courses assigned to the instructor along with the number of students enrolled
  viewMyCoursesAndNumberEnrolled: async (req, res) => {
    try {
      // Retrieve instructor details using email from headers
      const instructor = await instructorModel.getInstructorByEmail(req.headers.email);

      // Check if the instructor exists
      if (instructor.length === 0) {
        return res.status(404).json('NOT EXIST');
      }

      // Get the courses assigned to the instructor along with the number of students enrolled
      const instructorCourses = await instructorModel.getMyCoursesAndNumberEnrolled(instructor[0].id);

      // Check if the instructor has any courses
      if (instructorCourses.length === 0) {
        return res.status(200).json('NO COURSES EXIST');
      }

      // Return the list of courses with enrollment numbers
      res.status(200).json(instructorCourses);
    } catch (err) {
      // Handle any errors
      res.status(404).json(err);
    }
  },
  // Function to view students enrolled in a specific course
  viewStudents: async (req, res) => {
    try {
      // Retrieve students using course code from headers
      const students = await instructorModel.getStudents(req.headers.code);

      // Check if any students are enrolled in the course
      if (students.length === 0) {
        return res.status(200).json('NO STUDENTS ENROLLED');
      }

      // Return the list of students
      res.status(200).json(students);
    } catch (err) {
      // Handle any errors
      res.status(404).json(err);
    }
  },
  // Function to set grades for students
  setGrades: async (req, res) => {
    try {
      // Validate the request body for errors
      const errors = validationResult(req);

      // If there are validation errors, return a 422 status with the errors array
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      // Extract data from the request body
      const data = req.body;

      let studentData = [];

      // Add the grade to studentData array
      studentData.push({ grade: data.grade });

      // Retrieve student details using the email from request body
      const student = await studentModel.getStudentByEmail(data.student_email);

      // Check if the student exists
      if (student.length === 0) {
        return res.status(404).json('The Email Is Not Exist');
      }

      // Add student ID to studentData array
      studentData.push({ student_id: student[0].id });

      // Retrieve course details using the course code from request body
      const course = await courseModel.getCourseByCode(data.course_code);

      // Check if the course exists
      if (course.length === 0) {
        return res.status(404).json('The Course Is Not Exist');
      }

      // Add course ID to studentData array
      studentData.push({ course_id: course[0].id });

      // Set the grade for the student in the specified course
      const result = await instructorModel.setStudentGrade(studentData);

      // Return the result
      res.status(200).json(result);
    } catch (err) {
      // Handle any errors
      res.status(404).json(err);
    }
  },
  // Function to generate and send a JWT token
  generateToken: async (req, res) => {
    try {
      const { email } = req.body;
      // Retrieve instructor details using email from request body
      const instructor = await instructorModel.getInstructorByEmail(email);

      // Check if the instructor exists
      if (instructor.length === 0) {
        return res.status(404).json('Instructor not found');
      }

      // Generate JWT token with instructor's ID, email, and type
      const token = jwt.sign(
        { id: instructor[0].id, email: instructor[0].email, type: 'instructor' },
        SECRET_KEY,
        { expiresIn: '1h' } // Set token expiry time
      );

      // Return the generated token
      res.status(200).json({ token });
    } catch (err) {
      // Handle any errors
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = InstructorController;
