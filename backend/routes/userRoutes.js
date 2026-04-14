const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/verify/:token', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.post('/deleteUser', userController.deleteUser);
router.get('/getUserInfo/:userId', userController.getUserInfo);
router.post('/updateUser', userController.updateUser);
router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;