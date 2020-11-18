const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS || 10;
const genSalt = rounds => new Promise((resolve, reject) => {
  bcrypt.genSalt(rounds, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});
const hash = data => new Promise(async (resolve, reject) => {
  const salt = await genSalt(saltRounds);
bcrypt.hash(data, salt, null, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});
const compare = (data, encrypted) => new Promise((resolve, reject) => {
  bcrypt.compare(data, encrypted, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
};

module.exports = {
  hash,
  compare,
  hashPassword
};