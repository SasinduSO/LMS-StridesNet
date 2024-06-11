const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Use environment variable or a default secret key

const userController = {
  viewActiveCourses: async (req, res) => {
    try {
      const queryResult = await courseModel.getActiveCourses();
      res.status(200).json(queryResult);
    } catch (err) {
      res.status(404).json({ error: "Error fetching active courses" });
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
      //console.log("User fetched from DB: ", user);
      //console.log(loginData.password);
      const storedPassword = user[0].password.trim(); // Trim any leading or trailing whitespace
      const inputpw= loginData.password.trim();
      //console.log(storedPassword);

      if (user.length === 0) {
        return res.status(400).json({
          errors: [{ msg: "Email or Password Not Found!" }],
        });
      }

      if (user[0].status === 0) {
        return res.status(400).json({
          errors: [{ msg: "You are BLOCKED from the system. Please contact the admin." }],
        });
      }

      let checkPassword;
      if (["instructor", "admin", "student"].includes(user[0].type)) {
        // Direct comparison for plain text password stored in the database
    
        if(loginData.password === storedPassword){
          checkPassword = loginData.password === storedPassword;
        }
        else {
          // Comparison for hashed password stored in the database
          try {
            checkPassword = await bcrypt.compare(inputpw, storedPassword);
            //console.log("Password check result: ", checkPassword);
          } catch (bcryptError) {
            console.error("bcrypt compare error:", bcryptError);
            return res.status(500).json({ error: "Error comparing passwords" });
          }
        }
        
      } 
    //  console.log("Password check result: ", checkPassword);

      if (checkPassword) {
        const token = jwt.sign(
          { id: user[0].id, email: user[0].email, type: user[0].type },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        // Log the generated token and key to the console for testing
        console.log("Generated Token:", token);
        console.log("Generated Key:", SECRET_KEY);

        // Include the type in the response user object
        delete user[0].password;
       // console.log(user[0]);
        return res.status(200).json({ user: user[0], token });
      }

      return res.status(400).json({
        errors: [{ msg: "Email or Password Not Found!" }],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = userController;