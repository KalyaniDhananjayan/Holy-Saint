const express = require('express');
const router = express.Router();
const { getAllTshirts, getTshirtById, addTshirt, updateTshirt, deleteTshirt } = require('../controllers/tshirt-controller');


router.route('/welcome').get((req, res) => {
    res.send('Welcome to the Home Page');
});

module.exports = router;