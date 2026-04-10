const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');


router.post('/postCreation', socialController.postCreation);
router.post('/follow', socialController.follow);
router.post('/unfollow', socialController.unfollow);
router.post('/interact', socialController.interact);
router.get('/getPostsByUser/:userId', socialController.getPostsByUser);
router.get('/getPostsById/:postId', socialController.getPostsById);
router.post('/rate', socialController.rate);

module.exports = router;