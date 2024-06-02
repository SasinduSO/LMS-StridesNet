const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Use environment variable or a default secret key

const userController = {
  viewActiveCourses: async (req, res) => {
    try {
      const queryResult = await courseModel.getActiveCourses();
      res.status(200).json(queryResult);
    } catch (err) {
      res.status(404).json(err);
    }
  },

  login: async (req, res) => {
    try {
      const loginData = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const user = await userModel.checkEmailExists(loginData.email);
      console.log("User fetched from DB: ", user); //getting user from db

      if (user.length == 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email or Password Not Found !",
            },
          ],
        });
      }

      if (user[0].status === 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "You Are BLOCKED From The System, Please Contact The Admin ",
            },
          ],
        });
      }

      const checkPassword =
        (user[0].type === "instructor" ||
          user[0].type === "admin" ||
          user[0].type === "student")
          ? loginData.password === user[0].password
          : await bcrypt.compare(loginData.password, user[0].password);
      console.log("Password check result: ", checkPassword);

      if (checkPassword) {
        const token = jwt.sign(
          { id: user[0].id, email: user[0].email, type: user[0].type },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        // Log the generated token and key to the console to test
        console.log("Generated Token:", token);
        console.log("Generated Key:", SECRET_KEY);

        // Include the type in the response user object
        delete user[0].password;
        return res.status(200).json({ user: user[0], token });
      }

      res.status(400).json({
        errors: [
          {
            msg: "Email or Password Not Found !",
          },
        ],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err.message });
    }
  },
};

module.exports = userController;
