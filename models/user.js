var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },

    local: {

        username: {
            type: String,
            required: [true, 'Username is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        //required: [true, 'Email is required']
    },
    phone: {
        type: Number,
        //required: [true, 'Phone Number is required']
    },
    country: {
        type: String,
    },
    addressLine1: {
        type: String,
        //required: [true, 'Address is required']
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        //required: [true, 'City is required']
    },
    province: {
        type: String
    },
    postalCode: {
        type: Number
    }
});


userSchema.methods.generateHash = function(password) {
    //generate salted hash of plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
    //create hash of password entered, compare to stored hash
    // if hashes match, the passwords used to create them were the same
    return bcrypt.compareSync(password, this.local.password);
};

User = mongoose.model('User', userSchema);

module.exports = User;