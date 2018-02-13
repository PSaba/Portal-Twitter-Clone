var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, unique: true, required:true},
    handle: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    tweets: {type:Number, required: true},
    following: {type: Array, required: true},
    followers: {type: Array, required: true}
})

module.exports = mongoose.model('users', schema);