const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const config = require('../../config/db');
require("dotenv").config();


//----------------------- All Post Methods ----------------------------\\
//this rout response to register a new user
router.post('/api/customer/register', (req, res) => {
  const { FullName, Username, Email, password, Phone,Worker,UserType } = req.body;
  const customer = {}
  customer.FullName = FullName,
      customer.Username = Username,
      customer.Email = Email,
      customer.Phone = Phone,
      customer.password = password,
      customer.Worker = Worker,
      customer.UserType = UserType
  let newCustomer = new Customer(customer)

  Customer.addUser(newCustomer, (err, customer) => {
      if (err) {
          let message = "";
          if (err.errors.Username) message = "Username is already exist. ";
           if (err.errors.Email) message = "Email already exists.";
           if (err.errors.Username ) message = "Please Make sure to fill a valid Username.";
          if (err.errors.Email ) message = "Please Make sure to fill a valid Email.";
          if (err.errors.password ) message = "Please Make sure to fill a valid password.";
          if (err.errors.FullName) message = "Please Make sure to fill a valid FullName.";
          return res.json({
              success: false,
              message
          });
      } else {
          return res.json({
              success: true,
              message: "User registration is successful."
          });
      }
  });
});


//---------------The GET router-------------------
//Get User info By User ID
router.get('/api/customer/:UserId', (req, res) => {
    Customer.findById(req.params.UserId)
    .populate('ReceivedService') 
    .exec( (err, User) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',User);
      res.send(User.Username)
        });
      });


module.exports = router;