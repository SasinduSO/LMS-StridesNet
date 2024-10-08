const connection = require("../models/connection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

class AdminModel {

  //get queries 
  getInstructors() {
    const queryString =
      "SELECT name AS Name,email AS Email,phone As Phone,status AS Status  FROM user WHERE type = 'instructor'";

    const result = query(queryString);
    return result;
  }

  
    getEmployees() {
    const queryString =
      "SELECT name AS Name,email AS Email,phone As Phone,status AS Status  FROM user WHERE type = 'employee'";

    const result = query(queryString);
    return result;
  }
  
  getStudents() {
    const queryString =
      "SELECT name AS Name,email AS Email,phone As Phone,status AS Status FROM user WHERE type = 'student'";
    const result = query(queryString);
    return result;
  }
  getUser(email) {
    const queryString = "SELECT * FROM user WHERE email = ?";
    const result = query(queryString, email);
    return result;
  }
  getUserByPhone(phone) {
    const queryString = "SELECT * FROM user WHERE phone = ?";
    const result = query(queryString, phone);
    return result;
  }

  //delete queries
  deleteInstructorByEmail(instructorEmail) {
    const queryString =
      "DELETE FROM user WHERE email = ? && type = 'instructor'";
    const result = query(queryString, instructorEmail);
    return result;
  }
  

  deleteEmployeeByEmail(employeeEmail) {
    const queryString =
      "DELETE FROM user WHERE email = ? && type = 'employee'";
    const result = query(queryString, employeeEmail);
    return result;
  }


  deleteStudentByEmail(studentEmail) {
    const queryString = "DELETE FROM user WHERE email = ? && type = 'student'";
    const result = query(queryString, studentEmail);
    return result;
  }

  //insert queries

  insertInstructor(instructorData) {
    const queryString = "INSERT INTO user SET ?";
    const result = query(queryString, instructorData);
    return result;
  }

  insertEmployee(employeeData) {
    const queryString = "INSERT INTO user SET ?";
    const result = query(queryString, employeeData);
    return result;
  }

  insertStudent(studentData) {
    const queryString = "INSERT INTO user SET ?";
    const result = query(queryString, studentData);
    return result;
  }

  //update queries
  
  updateInstructorData(instructorData, oldEmail) {
    const queryString = "UPDATE user SET ? WHERE ?";
    const result = query(queryString, [instructorData, { email: oldEmail }]);
    return result;
  }


  updateEmployeeData(employeeData, oldEmail) {
    const queryString = "UPDATE user SET ? WHERE ?";
    const result = query(queryString, [employeeData, { email: oldEmail }]);
    return result;
  }


  updateStudentData(studentData, oldEmail) {
    const queryString = "UPDATE user SET ? WHERE ?";
    const result = query(queryString, [studentData, { email: oldEmail }]);
    return result;
  }
}
adminModel = new AdminModel();
module.exports = adminModel;
