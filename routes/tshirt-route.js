const express = require('express');
const router = express.Router();
const { getAllTshirts, getTshirtById, addTshirt, updateTshirt, deleteTshirt } = require('../controllers/tshirt-controller');


router.route('/')
    .get(getAllTshirts)
    .post(addTshirt);
router.route('/:id')
    .get(getTshirtById)
    .patch(updateTshirt)
    .delete(deleteTshirt)
    .delete(deleteTshirt);

module.exports = router;