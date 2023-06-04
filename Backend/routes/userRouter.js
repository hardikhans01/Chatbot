const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');


router
    .route('/signUp')
    .post(userController.signup);

router  
    .route('/login')
    .post(userController.login);


router
    .route('/')
    .post(userController.protect,userController.send_data);

router
    .route('/signOut')
    .get(userController.signOut);

module.exports = router