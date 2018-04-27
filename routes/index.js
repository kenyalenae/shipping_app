var express = require('express');
var router = express.Router();
var Shipping = require('../models/shipping');
var passport = require('passport');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    // This will be the home page of application
    // Redirect to account home page if the user is logged in
    // If user not logged in, the IsLoggedIn middleware
    // will catch that and redirect to login page
    res.redirect('/accountHome');
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

/* GET account home page */
router.get('/accountHome', isLoggedIn, function(req, res, next) {

    res.render('/accountHome', {
        username:req.user.local.username
    });
});

/* Middleware to verify if user is logged in, and to let them proceed
* If not, redirect them to login page. */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

/* GET new order form page. */
router.get('/newOrder', function(req, res, next) {
    res.render('newOrder')
});

/* POST create new order page. */
router.post('/newOrder', function(req, res, next){

    // use form data in req.body to create new order form
    var ship = Shipping(req.body);

    // Save the new order form to DB as a new Shipping document
    ship.save().then( (shippingDoc) => {
        console.log(shippingDoc); // not required, but helps to see whats happening
        res.redirect('/newOrder'); // create a request to /newOrder to load new Order form page
    }).catch((err) => {
        next(err); // Send errors to the error handlers
    });
});

/* GET order statuses page. */
router.get('/orderStatus', function(req, res, next){

    // query to fetch all documents, just get the name fields and sort by name
    Shipping.find().select( {item:1} ).sort( {item:1} )
        .then( (shippingDoc) => {
            console.log('All orders', shippingDoc); // for debugging purposes
            res.render('orderStatus', {title: 'All Orders', orders:shippingDoc} )
        }).catch( (err) => {
            next(err);
    })
});

/* GET info about specific order */
router.get('/shipping/:_id', function(req, res, next){

    // get the _id of the order from req.params
    Shipping.findOne( { _id: req.params._id } )
        .then( (shippingDoc) => {
            if (shippingDoc) {
                console.log(shippingDoc); res.render('orderInfo', { description:shippingDoc.description , priceRange:shippingDoc.priceRange, shipMethod:shippingDoc.shipMethod } );
            } else {  // else, if order not found, shippingDoc will be undefined
                var err =  Error('Order not found'); // create a new error
                err.status = 404; // set the error status to 404
                throw err; // this causes the chained catch function to run
            }
        }).catch( (err) => {
            next(err); // 404 and database errors
    });
});

module.exports = router;
