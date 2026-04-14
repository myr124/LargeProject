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
router.get('/getAllPosts', socialController.getAllPosts);
router.post('/savePost', socialController.savePost);
router.post('/comment', socialController.comment);
router.get('/getFriendActivity/:userId', socialController.getFriendActivity);
router.get('/getFollowing/:userId', socialController.getFollowing);
router.get('/getTrendingIngredients', socialController.getTrendingIngredients);
router.post('/createList', socialController.createList);
router.get('/getLists/:userId', socialController.getLists);
router.get('/getListById/:listId', socialController.getListById);
router.post('/addToList', socialController.addToList);
router.post('/removeFromList', socialController.removeFromList);
router.post('/deleteList', socialController.deleteList);
router.post('/editPost', socialController.editPost);
router.post('/deletePost', socialController.deletePost);
router.post('/unsavePost', socialController.unsavePost);
router.get('/getSuggestedPosts/:userId', socialController.getSuggestedPosts);

module.exports = router;