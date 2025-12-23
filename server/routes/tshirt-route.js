const express = require('express');
const router = express.Router();
const { getAllTshirts, getTshirtById, addTshirt, updateTshirt, deleteTshirt } = require('../controllers/tshirt-controller');
const authController = require('../controllers/auth-controller');

router.route('/')
    .get(getAllTshirts)
    .post(authController.protect,authController.restrictTo('admin'), addTshirt);
router.route('/:id')
    .get(getTshirtById)
    .patch(authController.protect,authController.restrictTo('admin'), updateTshirt)
    .delete(authController.protect,authController.restrictTo('admin'), deleteTshirt)

module.exports = router;