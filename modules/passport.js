var passport = require('passport');
var db = require('./db');
var bcrypt = require('bcrypt');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        console.log('login info - ', username, password);
        db.query(`SELECT * FROM member WHERE email='${username}'`, function (err, user) {
            if (err) { return done(err); }
            if (user.length === 0) {
                console.log('Incorrect username.');
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (!result) {
                    console.log('Incorrect password.');
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    console.log('username / password match success.');
                    return done(null, user[0]);
                }
            });
        });
    }
));

passport.use(new GoogleStrategy(
    {
        clientID: '504112456558-814jed5jc5vmhm8lq898hbpvl80lhmn4.apps.googleusercontent.com',
        clientSecret: 'lCcA7gQSn1V5BoL5EduI4tc-',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {        
        db.query(`SELECT * FROM member WHERE email='${profile.emails[0].value}'`, (err, users) => {
            if (users.length > 0) {
                return done(err, users[0]);
            } else {
                var user = {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    nickname: profile.displayName,
                }

                db.query(`INSERT INTO member(email, name, nickname) VALUES('${user.email}','${user.name}','${user.nickname}')`, (err, result) => {
                    if (result.affectedRows > 0) {
                        return done(err, user);
                    }
                });
            }
        });
    })
);

passport.serializeUser(function (user, done) {
    console.log('serializeUser - ', user.email);
    done(null, user.email);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser - ', id);

    db.query(`SELECT * FROM member WHERE email='${id}'`, function (error, user) {
        done(error, user[0]);
    });
});

module.exports = passport;