const express = require('express');
const router = express.Router();
const meetingsController = require('../controller/meetingsController');

router.get('/meetings', meetingsController.getAllMeetings);
router.post('/meetings', meetingsController.createMeeting);
router.get('/meetings/:link', meetingsController.getMeeting);
router.put('/meetings/:link', meetingsController.updateMeeting);
router.delete('/meetings/:link', meetingsController.deleteMeeting);

module.exports = router;