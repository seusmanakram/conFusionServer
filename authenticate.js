var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose sets up the basic authenticate function else we have to do ourselves
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWTPayload: ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, usr) => {
        if (err) {
            done(err, false);
        } else if (usr) {
            done(null, usr);
        }
        else {
            done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });


exports.verifyAdmin = (req,res,next) => {
    // Check user is admin or not
    if(req.user.admin){
        next();
    }else{
        var err = new Error("You are not authorized to perform this operation!"); 
        err.status = 403;
        return next(err);
    }
};

exports.faceboolPassport = passport.use(new 
FacebookTokenStrategy({
    
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        console.log("Info "+ profile);
        User.findOne({facebookId: profile.id}, (err, user) => {
            if(err){
                return done(err, false);
            }
            if(!err && user !== null){

                return done(null, user);
            }
            else {
                user = new User({ username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if(err) {
                        return done(err, false);
                    }
                    else {
                        return done(null, user);
                    }
                })
            }
        });

    }

));