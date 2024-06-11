const connection = require("../models/connection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

class CourseModel {
  getCourses() {
    const queryString = `SELECT c.name As Name, c.code As Code,c.status As Status, u.email AS 'Instructor Email', c.price AS price
    FROM course AS c
    LEFT JOIN user AS u
    ON c.instructor_id=u.id`;
    const result = query(queryString);
    return result;
  }
  getActiveCourses() {
    const queryString = `SELECT c.name AS CourseName, c.code, u.name AS InstructorName, c.price AS price
    FROM course AS c
    INNER JOIN user AS u
    ON c.instructor_id=u.id
    WHERE c.status = 1`;
    const result = query(queryString);
    return result;
  }
  getCourseByCode(code) {
    const queryString = "SELECT * FROM course WHERE ?";
    const result = query(queryString, { code: code });
    return result;
  }
  getCourseById(id) {
    const queryString = "SELECT * FROM course WHERE ?";
    const result = query(queryString, { id: id });
    return result;
  }

  insertCourse(courseData) {
    const queryString = "INSERT INTO course SET ?";
    const result = query(queryString, {
      name: courseData.name,
      code: courseData.code,
      price: courseData.price
    });
    return result;
  }
  async updateCourse(courseData, oldCode) {
    const queryString = "UPDATE course SET ? WHERE ?";
    const result = await query(queryString, [courseData, {code: oldCode}]);
    console.log(result);
    return result;
  }
    async deleteCourse(courseCode) {
    console.log(courseCode)
    const queryString = "DELETE FROM course WHERE code = ?";
    const result = await query(queryString, [courseCode]);
    console.log(result)
    return result;
}

  updateInstructorId(courseCode, instructorId) {
    const queryString = "UPDATE course SET ? WHERE ?";
    const result = query(queryString, [
      {
        instructor_id: instructorId,
      },
      {
        code: courseCode,
      },
    ]);
    return result;
  }
  getInstructorCourses(instructorId) {
    const queryString = `SELECT c.name, c.code
    FROM course as c
    WHERE c.instructor_id = ?`;
    const result = query(queryString, instructorId);
    return result;
  }
  updateStatus(courseCode, courseStatus) {
    const queryString = "UPDATE course SET ? WHERE ?";
    const result = query(queryString, [
      {
        status: courseStatus,
      },
      {
        code: courseCode,
      },
    ]);
    return result;
  }
  deleteFromStudentCourse(courseId) {
    const queryString = "DELETE FROM studentcourse WHERE ?";
    const result = query(queryString, { course_id: courseId });
    return result;
  }
}

courseModel = new CourseModel();
module.exports = courseModel;
