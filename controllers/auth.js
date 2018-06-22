var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router();


// GET /auth/signup - send the form for signup
router.get('/signup', function (req, res) {
  res.render('auth/signup');
});

// GET /auth/login - send the form for login
router.get('/login', function (req, res) {
  res.render('auth/login');
});

// POST /auth/signup - the route that processes the signup form
router.post('/signup', function (req, res) {
  // This looks up the user in the DB
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function (user, created) {
    if (created) {
      // No record was found, so we created one
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req, res); // IIFE - Immediately-Invoked Function Expression
    } else {
      // We found a record, so they can't sign up with that email address
      req.flash('error', 'Email already exists!');
      res.redirect('/auth/signup');
    }
  }).catch(function (error) {
    // Catch any additional errors
    console.log(error.message);
    res.redirect('/auth/signup');
  });
});

// POST /auth/login - the route that processes the login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in!',
  failureFlash: 'Invalid username and/or password!'
}));

// GET /auth/logout - the route that logs you out
router.get('/logout', function (req, res) {
  // Passport logout() removes req.user and clears the session
  req.logout();
  req.flash('success', 'You have logged out!');
  res.redirect('/');
});

// 

module.exports = router;
