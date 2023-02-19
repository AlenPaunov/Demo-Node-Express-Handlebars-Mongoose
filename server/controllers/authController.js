import express from 'express';
import { authenticate } from '../middlewares/auth-middlewares.js';
import User from '../models/User.js';
const authController = express.Router();

authController
  .get('/register', (req, res) => {
    res.render('auth/register');
  })
  .post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const userData = { username, password, email };
    const user = new User(userData);

    user.save()
      .then(() => user.generateAuthToken())
      .then((token) => {
        res.header('x-auth', token).send(user);
      })
      .catch(error => {
        res.status(400).send(error.message);
      });
  })
  .get('/login', (req, res) => {
    res.render('auth/login');
  })
  
  .post('/login', async (req, res) => {
    const { username, password } = req.body;

    User.findByCredentials(username, password)
      .then(user => user.generateAuthToken())
      .then((token) => { 
        res.cookie('session', token, { httpOnly: true });
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
        // res.status(400).send(err);
      })
  })
  .get('/me', authenticate, (req, res) => {
    res.send(req.user);
  });

export default authController;
