var express = require('express');
var Shipping = require('../models/shipping');

var router = express.Router();

/* verify that admin is logged in */
router.use(isAdminLoggedIn);

function isAdminLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            next()
        }
        else {
            res.sendStatus(403) // unauthorized
        }
    }
    else {
        res.redirect('/')
    }
}

router.get('/', function(req, res, next){
    res.send('this is the admin home page')
});

/* Home page for admin. User should sign in */
router.get('/allOrders', function(req, res, next) {
    Shipping.find().then( (allOrders) => {
        res.render('allOrders', {orders: allOrders})
    })
});

module.exports = router;

