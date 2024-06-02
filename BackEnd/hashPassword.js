const bcrypt = require('bcrypt');
const saltRounds = 10;

const plainPassword = 'sso123'; //"admin password"

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
//output of hashed password
  }
});