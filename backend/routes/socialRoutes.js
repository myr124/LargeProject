const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');


router.post('/postCreation', socialController.postCreation);
router.post('/follow', socialController.follow);
router.post('/unfollow', socialController.unfollow);
router.post('/interact', socialController.interact);

module.exports = router;