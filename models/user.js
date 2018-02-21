var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var schema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, unique: true, required:true},
    handle: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    tweets: {type:Number, required: true},
    following: {type: Array},
    followers: {type: Array}
});

schema.methods.checkPassword = function(password){
    return bcrypt.compare(password, this.password)
};

var salt = 10;

schema.statics.hashPassword = function(password){
    return bcrypt.hashSync(password, salt);
};

module.exports = mongoose.model('users', schema);