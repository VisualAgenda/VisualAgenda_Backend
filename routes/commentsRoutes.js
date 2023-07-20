const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');

router.post('/meetings/:link/timeslots/:timeslotId/comments', commentsController.createComment);
router.get('/meetings/:link/timeslots/:timeslotId/comments', commentsController.getAllComments);
router.get('/meetings/:link/timeslots/:timeslotId/comments/:commentId', commentsController.getCommentWithId);
router.delete('/meetings/:link/timeslots/:timeslotId/comments/:commentId', commentsController.deleteComment);

module.exports = router;
