var mongoose = require('mongoose');

var schema = mongoose.Schema({
    user: {type: Object, required: true},
    information: {type: String, unique: true, required:true},
    date: {type: Date, unique: true, required: true},
})

module.exports = mongoose.model('posts', schema);