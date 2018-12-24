var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config')


exports.local = passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose sets up the basic authenticate function else we have to do ourselves
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,  (jwt_payload, done) => {
    console.log("JWTPayload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, usr) => {
        if(err){
            done(err, false);
        }else if(usr){
            done(null, usr);
        }
        else{
            done(null, false);
        }
    });

}));


exports.verifyUser = passport.authenticate('jwt', {session: false});











 