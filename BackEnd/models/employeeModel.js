const connection = require("../models/connection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

class EmployeeModel {


  // RETRIEVE Employee ID
  getEmployeeByEmail(employeeEmail) {
    const queryString = "SELECT * FROM user WHERE ? AND type = 'employee'";
    const result = query(queryString, { email: employeeEmail });
    return result;
  }
}
employeeModel = new EmployeeModel();
module.exports = employeeModel;
