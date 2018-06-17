var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//DB Connection & Schema

mongoose.Promise = global.Promise;

var customersSchema = new mongoose.Schema({
    customerID: { type: Number, index: true, unique: true },
    name: String,
    birthday: Date,
    customerLifetimeValue: Number,
    gender: String,
    lastContact: Date
});

var Customers = mongoose.connection.model('customers', customersSchema);


module.exports = router;