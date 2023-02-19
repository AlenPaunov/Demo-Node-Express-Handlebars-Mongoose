import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  roles: {

  },
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 20,
    minlength: 4,
  },

  password: {
    type: String,
    required: true,
    minlength: 3,
  },

  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    }
  ]
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, '53CR3T').toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

userSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();

  return { _id: userObj._id, email: userObj.email, username: userObj.username, password: userObj.password };
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decodedToken;

  try {
    decodedToken = jwt.verify(token, '53CR3T');
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    '_id': decodedToken._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function (username, password) {
  var User = this;

  return new Promise((resolve, reject) => {
    return User.findOne({ username })
      .then(user => {
        if (user == null) {
          reject();
        }
        else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            } else {
              reject(err);
            }
          })
        }
      })
  });
};

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  });
}

userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    hashPassword(user.password)
      .then((hashedPassword) => user.password = hashedPassword)
      .then(() => next());
  } else {
    next();
  }
});

export default mongoose.model('User', userSchema);