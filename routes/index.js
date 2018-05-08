var express = require('express');
var Shipping = require('../models/shipping');
var User = require('../models/user');

var router = express.Router();

/* verify if customer is logged in */

router.use(function isLoggedIn(req, res, next){
    console.log('is logged in');
    if (req.isAuthenticated()) {
        if (req.user.role === 'customer') {
            next()
        } else {
            res.sendStatus(403) //unauthorized
        }
    } else {
        res.redirect('/')
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('new order?');
});

/* GET new order form page. */
router.get('/newOrder', function(req, res, next) {
    res.render('newOrder')
});

/* POST create new order page. */
router.post('/newOrder', function(req, res, next){

    // use form data in req.body to create new order form
    var ship = Shipping(req.body);
    ship._creator = req.user;

    // Save the new order form to DB as a new Shipping document
    ship.save().then( (shippingDoc) => {
        console.log(shippingDoc); // not required, but helps to see whats happening
        res.redirect('/orderMessage'); // create a request to /newOrder to load new Order form page
    }).catch((err) => {
        next(err); // Send errors to the error handlers
    });
});

/* GET order message page. */
router.get('/orderMessage', function(req, res, next) {
    res.render('orderMessage')
});

/* GET order statuses page. */
router.get('/orderStatus', function(req, res, next){


    // Shipping.find({_creator: req.user._id, completed: false}).then( order => {
    //     console.log('Order', order); // for debugging
    //     res.render('orderStatus', {order: order})
    // }).catch( (err) => {
    //     next(err)
    // })

    // query to fetch all documents, need to get the name fields and sort by name
    Shipping.find().select( {item:1} ).sort( {item:1} )
        .then( (shippingDoc) => {
            console.log('All orders', shippingDoc); // for debugging purposes
            res.render('orderStatus',
                {title: 'All Orders', orders:shippingDoc} )
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
                console.log(shippingDoc); res.render('orderInfo', { description:shippingDoc.description, priceRange:shippingDoc.priceRange, shipMethod:shippingDoc.shipMethod, productWebsite:shippingDoc.productWebsite } );
            } else {  // else, if order not found, shippingDoc will be undefined
                var err =  Error('Order not found'); // create a new error
                err.status = 404; // set the error status to 404
                throw err; // this causes the chained catch function to run
            }
        }).catch( (err) => {
            next(err); // 404 and database errors
    });
});

/* GET account info page */
router.get('/accountInfo', function(req, res, next) {
    res.render('accountInfo', {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        country: req.user.country,
        addressLine1: req.user.addressLine1,
        addressLine2: req.user.addressLine2,
        city: req.user.city,
        province: req.user.province,
        postalCode: req.user.postalCode
    });
});

/* POST update account information */
router.post('/updateAccountInfo', function(req, res, next){

    if (req.body.firstName || req.body.lastName || req.body.email || req.body.phone ||
    req.body.country || req.body.addressLine1 || req.body.addressLine2 || req.body.city ||
    req.body.province || req.body.postalCode) { // if any fields have been updated
        // add to the req.user object
        req.user.firstName = req.body.firstName || req.user.firstName;
        req.user.lastName = req.body.lastName || req.user.lastName;
        req.user.email = req.body.email || req.user.email;
        req.user.phone = req.body.phone || req.user.phone;
        req.user.country = req.body.country || req.user.country;
        req.user.addressLine1 = req.body.addressLine1 || req.user.addressLine1;
        req.user.addressLine2 = req.body.addressLine2 || req.user.addressLine2;
        req.user.city = req.body.city || req.user.city;
        req.user.province = req.body.province || req.user.province;
        req.user.postalCode = req.body.postalCode || req.user.postalCode;

        // save the modified user, to save to the database
        req.user.save()
            .then( () => {
                req.flash('updateMsg', 'Your information was updated')
                res.redirect('/accountInfo');
            })
            .catch ( (err) => {
                if (err.name === 'ValidationError') {
                    req.flash('updateMsg', 'Your information is not valid')
                    res.redirect('/accountInfo');
                } else {
                    next(err);
                }
            });
    } else {
        req.flash('updateMsg', 'Please enter some data');
        res.redirect('/accountInfo');
    }
});

module.exports = router;
