const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Service = require('../models/Service');



//---------------The GET router-------------------
//Find all service depend on userId and if the ServiceState is closed
router.get('/api/service/closed/:WorkerId', (req, res) => {
    Customer.findById(req.params.WorkerId, (error, foundWorker) => {
      Service.find({})
        .where("ServiceState").in('closed')
        .populate('ServicesEmp')
  
        .exec((err, Customer) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          console.log(`found and populated all : ${Customer}`);
          res.status(200).json(Customer);
        })
    });
  });


//---------------The PATCH router-------------------
//Update Service by Service Id
router.patch('/api/UpdateService/:ServiceId', (req, res) => {
    Service.findById(req.params.ServiceId, async (error, foundService) => {
      try {
        await foundService.update(req.body);
        res.status(200).json(req.body);
      } catch (error) {
        res.status(404).json(error);
      }
    });
  });




//---------------The Delete router-------------------  
//Delete Service by Service Id
router.delete('/api/DeleteService/:ServiceId', (req, res) => {
    Service.findById(req.params.ServiceId, async (error, foundService) => {
      try {
        await foundService.remove();
        res.status(200).json(`Service Id:  ${req.params.ServiceId} has been deleted `);
      } catch (error) {
        res.status(404).json({
          error: {
            name: 'DocumentNotFound',
            massage: 'The provided ID dose not match any Document on Service'
          }
        });
      }
    });
  });
  
  
  
  
  module.exports = router