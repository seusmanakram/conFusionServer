var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');



exports.local = passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose sets up the basic authenticate function else we have to do ourselves
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

