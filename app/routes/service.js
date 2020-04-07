const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Service = require('../models/Service');

//-------------Delete Service by Service Id-------------------
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