const adminModel = require("../models/adminModel");
const courseModel = require("../models/courseModel");
const studentModel = require("../models/studentModel");
const instructorModel = require("../models/instructorModel");
const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Use environment variable or a default secret key

const AdminController = {
  viewInstructors: async (req, res) => {
    try {
      const instructors = await adminModel.getInstructors();

      if (instructors.length == 0) {
        return res.status(200).json("No Instructors Found");
      }

      res.status(200).json(instructors);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  
    viewEmployees: async (req, res) => {
    try {
      const employees = await adminModel.getEmployees();

      if (employees.length == 0) {
        return res.status(200).json("No Assistants Found");
      }

      res.status(200).json(employees);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  
  viewStudents: async (req, res) => {
    try {
      const students = await adminModel.getStudents();

      if (students.length == 0) {
        return res.status(200).json("No Students Found");
      }

      res.status(200).json(students);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  viewCourses: async (req, res) => {
    try {
      const courses = await courseModel.getCourses();

      if (courses.length == 0) {
        return res.status(200).json("No Courses Found");
      }

      res.status(200).json(courses);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  getCourse: async (req, res) => {
    try {
      const course = await courseModel.getCourseByCode(req.params.code);

      if (course.length == 0) {
        return res.status(400).json("Course Not Found");
      }

      res.status(200).json(course);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  getInstructor: async (req, res) => {
    try {
      const instructor = await instructorModel.getInstructorByEmail(req.params.email);

      if (instructor.length == 0) {
        return res.status(400).json("Instructor Not Found");
      }

      res.status(200).json(instructor);
    } catch (err) {
      res.status(404).json(err);
    }
  },

  
  getEmployee: async (req, res) => {
    try {
      const employee = await employeeModel.getEmployeeByEmail(req.params.email);

      if (employee.length == 0) {
        return res.status(400).json("Employee Not Found");
      }

      res.status(200).json(employee);
    } catch (err) {
      res.status(404).json(err);
    }
  },

  

  getStudent: async (req, res) => {
    try {
      const student = await studentModel.getStudentByEmail(req.params.email);

      if (student.length == 0) {
        return res.status(400).json("Student Not Found");
      }

      res.status(200).json(student);
    } catch (err) {
      res.status(404).json(err);
    }
  },
  deleteInstructor: async (req, res) => {
    try {
      const instructor = await adminModel.getUser(req.body.email);

      if (instructor.length === 0) {
        return res.status(404).json("Instructor Email Is Not Exists");
      }

      const instructorCourses = await courseModel.getInstructorCourses(instructor[0].id);

      if (instructorCourses.length === 0) {
        await adminModel.deleteInstructorByEmail(instructor[0].email);
        return res.status(200).json("Instructor Deleted Successfully");
      }

      res
        .status(400)
        .json(
          "You Should In-Active his Courses or Assign Them To Anthor Instructor"
        );
    } catch (err) {
      res.status(404).json(err);
    }
  },


  deleteEmployee: async (req, res) => {
    try {
      const employee = await adminModel.getUser(req.body.email);

      if (employee.length == 0) {
        return res.status(404).json("Employee Email Is Not Exists");
      }

      await adminModel.deleteEmployeeByEmail(employee[0].email);
      res.status(200).json("Employee Deleted Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },



  deleteStudent: async (req, res) => {
    try {
      const student = await adminModel.getUser(req.body.email);

      if (student.length == 0) {
        return res.status(404).json("Student Email Is Not Exists");
      }

      await adminModel.deleteStudentByEmail(student[0].email);
      res.status(200).json("Student Deleted Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  deleteCourse: async (req, res) => {
    try {
      const course = await courseModel.getCourseByCode(req.body.code);

      if (course.length == 0) {
        return res.status(404).json("Course Is Not Exists");
      }
      //console.log(course[0].code) debugging
      await courseModel.deleteCourse(course[0].code);
      res.status(200).json("Course Deleted Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  addInstructor: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
       // return res.status(422).json({ errors: errors.array() });
      }

      const instructor = {
        name: req.body.name,
        //password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        type: "instructor",
      };

      const existingEmail = await adminModel.getUser(instructor.email);

      if (existingEmail.length > 0) {
        return res.status(409).json("Instructor Email Already Exists");
      }

      const existingPhone = await adminModel.getUserByPhone(instructor.phone);

      if (existingPhone.length > 0) {
        return res.status(409).json("Instructor Phone  Already Exists");
      }

      //password validation
      const instructorPassword = req.body.password;
      if (instructorPassword.length >= 8 && instructorPassword.length <= 50) {
        instructor.password = await bcrypt.hash(instructorPassword, 10);
      }
      console.log(instructor);
      await adminModel.insertInstructor(instructor);
      res.status(200).json("Instructor Added Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },

 addEmployee: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
       // return res.status(422).json({ errors: errors.array() });
      }

      const employee = {
        name: req.body.name,
       // password: await bcrypt.hash(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        type: "employee",
      };

      const existingEmail = await adminModel.getUser(employee.email);

      if (existingEmail.length > 0) {
        return res.status(409).json("Employee Email Is Already Existing");
      }

      const existingPhone = await adminModel.getUserByPhone(employee.phone);

      if (existingPhone.length > 0) {
        return res.status(409).json("Employee Phone Is Already Existing");
      }

       //password validation
       const employeePassword = req.body.password;
       if (employeePassword.length >= 8 && employeePassword.length <= 50) {
         employee.password = await bcrypt.hash(employeePassword, 10);
       }
      await adminModel.insertEmployee(employee);
      res.status(200).json("Employee Added Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },




  addStudent: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const student = {
        name: req.body.name,
        //password: await bcrypt.hash(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        token: crypto.randomBytes(16).toString("hex"),
        type: "student",
      };

      const existingEmail = await adminModel.getUser(student.email);

      if (existingEmail.length > 0) {
        return res.status(409).json("Student Email Is Already Exists");
      }

       //password validation
       const studentPassword = req.body.password;
       if (studentPassword.length >= 8 && studentPassword.length <= 50) {
         student.password = await bcrypt.hash(studentPassword, 10);
       }

      const existingPhone = await adminModel.getUserByPhone(student.phone);

      if (existingPhone.length > 0) {
        return res.status(409).json("Student Phone Is Already Exists");
      }

      await adminModel.insertStudent(student);
      res.status(200).json("Student Added Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  addCourse: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const course = req.body;

      const existingCode = await courseModel.getCourseByCode(course.code);

      if (existingCode.length > 0) {
        return res.status(409).json("Course Code Is Already Exists");
      }
      //console.log(course);
      //insert course and catch result from dbb
      await courseModel.insertCourse(course);
    
      const courseId = course.code;

        // Create a new table for the course materials
        await courseModel.createMaterialsTable(courseId);
      res.status(200).json("Course Added Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
   updateInstructor : async (req, res) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      // Retrieve the current instructor data
      const instructorOldData = await adminModel.getUser(req.body.oldEmail);
      if (instructorOldData.length === 0) {
        return res.status(404).json("Instructor Not Found");
      }
  
      // Check for email and phone conflicts
      const existingEmail = await adminModel.getUser(req.body.email);
      if (existingEmail.length > 0 && req.body.email !== instructorOldData[0].email) {
        return res.status(409).json("Email Already Exists");
      }
  
      const existingPhone = await adminModel.getUserByPhone(req.body.phone);
      if (existingPhone.length > 0 && req.body.phone !== instructorOldData[0].phone) {
        return res.status(409).json("Instructor Phone Already Exists");
      }
  
      // Prepare updated instructor data
      let instructor = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        type: "instructor",
      };
  
      // Update password if provided and meets the criteria
      const instructorPassword = req.body.password;
      if (instructorPassword.length >= 8 && instructorPassword.length <= 50) {
        instructor.password = await bcrypt.hash(instructorPassword, 10);
      }
  
      // Check if the status is being changed to inactive
      if (instructor.status == "0" && instructorOldData[0].status == "1") {
        const instructorCourses = await courseModel.getInstructorCourses(instructorOldData[0].id);
        if (instructorCourses.length > 0) {
          return res.status(400).json("You Should In-Active his Courses or Assign Them To Another Instructor");
        }
      }
  
      // Perform the update
      await adminModel.updateInstructorData(instructor, instructorOldData[0].email);
      return res.status(200).json("Instructor Updated Successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let employee = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        type: "employee",
      };

      const employeePassword = req.body.password;

      if (employeePassword.length >= 8 && employeePassword.length <= 50) {
        employee = Object.assign(employee, {
          password: await bcrypt.hash(employeePassword, 10),
        });
      }

      const existingEmail = await adminModel.getUser(employee.email);

      const employeeOldData = await adminModel.getUser(req.body.oldEmail);

      if (
        existingEmail.length > 0 &&
        employee.email != employeeOldData[0].email
      ) {
        return res.status(409).json("Email Already Exists");
      }

      const existingPhone = await adminModel.getUserByPhone(employee.phone);

      if (
        existingPhone.length > 0 &&
        employee.phone != employeeOldData[0].phone
      ) {
        return res.status(409).json("Phone Already Exists");
      }

      if (employee.status == "1") {
        await adminModel.updateEmployeeData(
          employee,
          employeeOldData[0].email
        );
        return res.status(200).json("Employee Updated Successfully");
      }


    } catch (err) {
      res.status(404).json(err);
    }
  },
  



  updateStudent: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let student = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        token: crypto.randomBytes(16).toString("hex"),
        type: "student",
      };

      const studentPassword = req.body.password;

      if (studentPassword.length >= 8 && studentPassword.length <= 50) {
        student = Object.assign(student, {
          password: await bcrypt.hash(studentPassword, 10),
        });
      }

      const existingEmail = await adminModel.getUser(student.email);

      const studentOldData = await adminModel.getUser(req.body.oldEmail);

      if (
        existingEmail.length > 0 &&
        student.email != studentOldData[0].email
      ) {
        return res.status(409).json("Email Already Exists");
      }

      const existingPhone = await adminModel.getUserByPhone(student.phone);

      if (
        existingPhone.length > 0 &&
        student.phone != studentOldData[0].phone
      ) {
        return res.status(409).json("Student Phone Already Exists");
      }

      await adminModel.updateStudentData(student, studentOldData[0].email);
      res.status(200).json("Student Updated Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  updateCourse: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const course = {
        name: req.body.name,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status,
      };

      const courseOldCode = req.body.oldCode;

      const courseOldStatus = req.body.oldStatus;

      if (courseOldStatus == "0" && course.status == "1") {
        return res
          .status(400)
          .json(
            "To Change Course Status To 'Active', You Should Assign Instructor To The Course"
          );
      }

      const courseId = await courseModel.getCourseByCode(courseOldCode).id;

      const existingCode = await courseModel.getCourseByCode(course.code);

      if (existingCode.length > 0 && course.code != courseOldCode) {
        return res.status(409).json("Course Code Is Already Exists");
      }

      if (course.status == "0") {
        await courseModel.updateInstructorId(course.code, null);
        await courseModel.deleteFromStudentCourse(courseId);
      }

      await courseModel.updateCourse(course, courseOldCode);
      res.status(200).json("Course Updated Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
  assignInstructorsToCourse: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const data = req.body;

      const instructor = await adminModel.getUser(data.instructor_email);

      if (
        instructor.length == 0 ||
        instructor[0].type != "instructor" ||
        instructor[0].status == "0"
      ) {
        return res.status(400).json("Instructor Not Exist or In-Active");
      }

      const instructorId = instructor[0].id;

      const course = await courseModel.getCourseByCode(data.code);

      if (course.length == 0) {
        return res.status(400).json("Course Not Exist");
      }

      await courseModel.updateInstructorId(data.code, instructorId);
      await courseModel.updateStatus(data.code, "1");
      res.status(200).json("Done Successfully");
    } catch (err) {
      res.status(404).json(err);
    }
  },
};

module.exports = AdminController;
