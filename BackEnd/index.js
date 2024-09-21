const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const user = require("./routes/user");
const admin = require("./routes/admin");
const instructor = require("./routes/instructor");
const student = require("./routes/student");
const payment =  require("./routes/payRoute")


// User
app.use("", user);

//Admin
app.use("", admin);

//Instructor
app.use("", instructor);

//Student
app.use("", student);

//payment
app.use("", payment);

app.listen(4000, "localhost", (err) => {
  console.log(err);
  console.log("server listening on port 4000");

});
