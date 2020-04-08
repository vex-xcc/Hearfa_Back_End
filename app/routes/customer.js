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
// this rout response to check user input and match them
//with database and login the user
router.post('/api/customer/login', (req, res) => {
  const Username = req.body.Username;
  const password = req.body.password;

  Customer.getUserByUsername(Username, (err, customer) => {
      if (err) throw err;
      if (!customer) {
          return res.json({
              success: false,
              message: "User not found."
          });
      }

      Customer.comparePassword(password, customer.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
              const token = jwt.sign({
                  type: "customer",
                  data: {
                      _id: customer._id,
                      Username: customer.Username,
                      FullName: customer.FullName,
                      Email: customer.Email,
                      Phone: customer.Phone,
                      Worker: customer.Worker,
                      UserType: customer.UserType
                  }
              }, config.database.secret, {
                  expiresIn: 18000 // for 5 Hou time in seconds
              });
              console.log(token);
              return res.json({
                  success: true,
                  token: "jwt " + token
              });
          } else {
              return res.json({
                  success: true,
                  message: "Wrong Password."
              });
          }
      });
  });
});
//---------------The GET router-------------------
//-------------Get ALl Customer RequestService By Customer ID-------------------

router.get('/api/customer/RequestService/:CustomerId', (req, res) => {
    Customer.findById(req.params.CustomerId)
    .populate('RequestService') 
    .exec( (err, oneCustomer) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',oneCustomer);
      res.send(oneCustomer.RequestService)
        });

      });
  
//-------------Get ALl Customer ReceivedService By Customer ID-------------------

router.get('/api/customer/ReceivedService/:CustomerId', (req, res) => {
    Customer.findById(req.params.CustomerId)
    .populate('ReceivedService') 
    .exec( (err, oneCustomer) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',oneCustomer);
      res.send(oneCustomer.ReceivedService)
        });

      });
//Get User info By User ID
router.get('/api/customer/:UserId', (req, res) => {
    Customer.findById(req.params.UserId)
    .exec( (err, User) =>{
      if (err) return res.status(404).json(err);
      console.log('Services',User);
      res.send(User.Username)
        });
      });


module.exports = router;