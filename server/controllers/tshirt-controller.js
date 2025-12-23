const TShirt = require('../models/tshirt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const addTshirt = catchAsync(async (req, res) => {
  const tshirt = await TShirt.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tshirt
    }
  });
});

// GET - Get all t-shirts
const getAllTshirts = catchAsync(async (req, res) => {
  const tshirts = await TShirt.find();

  res.status(200).json({
    status: 'success',
    results: tshirts.length,
    data: {
      tshirts
    }
  });
});

// GET - Get single t-shirt by ID
const getTshirtById = catchAsync(async (req, res, next) => {
  const tshirt = await TShirt.findById(req.params.id);

  if (!tshirt) {
    return next(new AppError('No t-shirt found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tshirt
    }
  });
});

// PATCH - Update t-shirt
const updateTshirt = catchAsync(async (req, res, next) => {
  const tshirt = await TShirt.findByIdAndUpdate(req.params.id, req.body, {
    new: true,      // return updated doc
    runValidators: true
  });

  if (!tshirt) {
    return next(new AppError('No t-shirt found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tshirt
    }
  });
});

// DELETE - Remove t-shirt
const deleteTshirt = catchAsync(async (req, res, next) => {
  const tshirt = await TShirt.findByIdAndDelete(req.params.id);

  if (!tshirt) {
    return next(new AppError('No t-shirt found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllTshirts,
  getTshirtById,
  addTshirt,
  updateTshirt,
  deleteTshirt
};