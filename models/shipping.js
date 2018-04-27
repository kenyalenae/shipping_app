var mongoose = require('mongoose');

var shippingSchema = new mongoose.Schema({
    item: String, // Name of item they want shipped
    description: String, // Description of item e.g. desired color
    priceRange: Number, // Desired price range of item
    shipMethod: String
});

var Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;
