const express = require('express');
const router = express.Router();
const timeslotsController = require('../controller/timeslotsController');

router.post('/meetings/:link/timeslots', timeslotsController.createTimeslot);
router.get('/meetings/:link/timeslots', timeslotsController.getAllTimeslots);
router.get('/meetings/:link/timeslots/:timeslotId', timeslotsController.getTimeslot);
router.put('/meetings/:link/timeslots/:timeslotId', timeslotsController.updateTimeslot);
router.delete('/meetings/:link/timeslots/:timeslotId', timeslotsController.deleteTimeslot);

module.exports = router;