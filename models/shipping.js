var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var shippingSchema = new mongoose.Schema({
    item: String, // Name of item they want shipped
    description: String, // Description of item e.g. desired color
    priceRange: Number, // Desired price range of item
    shipMethod: String,
    complete: { type: Boolean, default: false },

    /* This is a reference to the User object who created this order
    * To populate this field with all details of User object
    * use the populate() function */
    _creator: { type:ObjectId, ref:'User' }
});

var Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;
