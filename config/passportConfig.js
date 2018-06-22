var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

// This turns the user into just an ID for serializing
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

// This takes that ID and looks up the user in the DB
passport.deserializeUser(function(id, cb) {
  db.user.findById(id).then(function(user) {
    cb(null, user);
  }).catch(cb);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, cb) {
  db.user.find({
    where: {email: email}
  }).then(function(user) {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

module.exports = passport;