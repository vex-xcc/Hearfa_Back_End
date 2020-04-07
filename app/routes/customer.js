const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const config = require('../../config/db');

require("dotenv").config();

//-------------Get User info By User ID-------------------
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