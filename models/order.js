var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var orderSchema = new mongoose.Schema ({

    item: String,
    delivered: { type: Boolean, default: false },

    /* This is a reference to the User object who created this order
    * To populate this field with all details of User object
    * use the populate() function */
    _creator: { type:ObjectId, ref:'User', populate }

});

var Order = mongoose.model('order', orderSchema);

module.exports = Order;
