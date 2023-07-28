const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');

router.post('/meetings/:link/timeslots/:timeslotId/comments', commentsController.createComment);
router.get('/meetings/:link/timeslots/:timeslotId/comments', commentsController.getAllCommentsOfTimeslot);


router.get('/meetings/:link/comments', commentsController.getAllComments); 
router.delete('/meetings/:link/comments/:commentId', commentsController.deleteComment);
router.get('/meetings/:link/comments/:commentId', commentsController.getCommentWithId);


module.exports = router;
