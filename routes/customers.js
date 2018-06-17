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

//REST API Endpoints

router.get('/get_all_customer/', function(req, res, next) {
    getAllCustomer(res);
});

router.get('/get_customer/:id/', function(req, res, next) {
    getCustomer(req.params.id, res);
});

router.post('/add/', function(req, res, next) {
    addCustomers(req.body.data, res);
});

router.put('/update/', function(req, res, next) {
    updateCustomer(req.body.data, res);
});

router.delete('/remove/', function(req, res) {
    removeCustomers(req.body.id, res);
})

//Functions

var getAllCustomer = function(res) {
    Customers.find({}, function(err, data) {
        if (err) {
            res.status(400).json({
                message: 'failed'
            });
        } else {
            res.status(200).json(data);
        }
    });
};

var getCustomer = function(data, res) {
    Customers.find({ customerID: data }, function(err, data) {
        if (err) {
            res.status(400).json({
                message: 'Unable to Find Customer'
            });
        } else {
            res.status(200).json(data);
        }
    });
};

var addCustomers = function(data, res) {

    data.lastContact = new Date();
    data.name = JSON.stringify(data.name);

    var signUp = Customers(data).save(function(err, data) {
        if (err) {
            res.status(400).json({
                message: 'failed'
            });
        }
        res.status(200).json(data);
    });
};

var updateCustomer = function(data, res) {

    data.name = JSON.stringify(data.name);

    delete data._id;

    Customers.update({ customerID: data.customerID },data, {upsert: true}, function(err, data) {
        if (err) {
            res.status(400).json({
                message: 'failed'
            });
        } else {
            res.status(200).json({
                message: 'Updated'
            });
        }
    });
};

var removeCustomers = function(data, res) {

    Customers.findOneAndRemove({ customerID: data }, function(err, data) {
        if (err) {
            res.status(400).json({
                message: 'Unable to Remove Profile'
            });
        } else {
            res.status(200).json(data);
        }

    });

};

router.get('/', function(req, res, next) {
    res.send('Up & Running');
});

module.exports = router;