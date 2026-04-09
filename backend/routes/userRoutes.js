const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/verify/:token', userController.verifyEmail);
router.post('/deleteUser', userController.deleteUser);
router.get('/getUserInfo/:userId', userController.getUserInfo);

module.exports = router;