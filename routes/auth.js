var express = require('express');
var passport = require('../modules/passport');
var router = express.Router();

router.get('/login', function (req, res, next) {
    var flash = req.flash();
    var feedback = '';
    if (flash.error) {
        feedback = flash.error[0];
    }
    res.render('login', {
        title: 'CHOVA CLUB',
        feedback: feedback
    });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout_process', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/login_process',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    }));


module.exports = router;