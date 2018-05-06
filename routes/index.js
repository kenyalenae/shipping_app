var express = require('express');
var Shipping = require('../models/shipping');

var router = express.Router();

/* verify if customer is logged in */
router.use(isLoggedIn);

function isLoggedIn(req, res, next){
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
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('newOrder');
});

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
        res.redirect('/orderStatus'); // create a request to /newOrder to load new Order form page
    }).catch((err) => {
        next(err); // Send errors to the error handlers
    });
});

/* GET order statuses page. */
router.get('/orderStatus', function(req, res, next){

    Shipping.findById(req.params._id).then( order => {
        res.render('order', {order: order})
    })

    // // query to fetch all documents, need to get the name fields and sort by name
    // Shipping.find().select( {item:1} ).sort( {item:1} )
    //     .then( (shippingDoc) => {
    //         console.log('All orders', shippingDoc); // for debugging purposes
    //         res.render('orderStatus',
    //             {title: 'All Orders', orders:shippingDoc} )
    //     }).catch( (err) => {
    //         next(err);
    // })
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
