var express = require('express');
var router = express.Router();
var passport = require('passport');


/* Middleware to verify if user is logged in, and to let them proceed
* If not, redirect them to login page. */
router.use(function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    // This will be the home page of application
    // Redirect to account home page if the user is logged in
    // If user not logged in, the IsLoggedIn middleware
    // will catch that and redirect to login page
    res.redirect('/accountHome');
});

/* GET account home page */
router.get('/accountHome', function(req, res, next) {

    res.render('accountHome', {
        username:req.user.local.username,
    });
});

/* GET signup page */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

/* POST to signup */
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/accountHome',
    failureRedirect: '/signup',
    failureFlash: true
}));

/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login');
});

/* POST to login */
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/accountHome',
    failureRedirect: '/login',
    failureFlash: true
}));

/* Get logout */
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;