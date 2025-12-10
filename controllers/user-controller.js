const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all users (ADMIN ONLY in future)
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// Get one user (ADMIN or logged-in user in future)
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No user found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Placeholders (will implement later)
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet!'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented yet!'
  });
};
