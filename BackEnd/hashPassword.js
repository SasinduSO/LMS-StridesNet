
const bcrypt = require('bcrypt');
const saltRounds = 10;
/*
const plainPassword = 'sso123'; //"admin password"

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
//output of hashed password
  }
});
*/

const hashedPassword = '$2b$10$srYnwAt4ysyjXUKKJFrivO.izVD.orPPs99jzbRxCPTbksKxauqui'; // your stored hashed password
const inputPassword = 'sas12345'; // the password you want to verify

checkPassword =  bcrypt.compare(inputPassword, hashedPassword);
console.log("Password check result: ", checkPassword);
bcrypt.compare(inputPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
    return; // Return to avoid further execution
  }

  if (result) {
    console.log('Password match!');
    console.log("Password check result: ", result);
  } else {
    console.log('Password does not match.');
  }
});