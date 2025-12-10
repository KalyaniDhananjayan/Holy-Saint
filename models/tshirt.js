const mongoose = require('mongoose');

const tshirtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'T-shirt must have a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name can not exceed 100 characters']
    },

    slug: String,

    description: {
      type: String,
      trim: true,
      required: [true, 'T-shirt must have a description']
    },

    price: {
      type: Number,
      required: [true, 'T-shirt must have a price'],
    },

    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: function(val) {
          // Only runs on CREATE (not update)
          return val <= this.price;
        },
        message: 'Discount must be less than or equal to price'
      }
    },


    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: [true, 'Available sizes must be specified']
    },


    designImages: {
      type: [String],
      required: [true, 'T-shirt design images are required']
    },

    designPosition: {
      type: String,
      enum: ['Front', 'Back', 'Sleeves'],
      default: 'Front'
    },

    material: {
      type: String,
      default: '100% Cotton'
    },

    stock: {
      type: Number,
      default: 0
    },

    isCustomizable: {
      type: Boolean,
      default: false
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // e.g., 4.666 => 4.7
    },

    ratingQuantity: {
      type: Number,
      default: 0
    },

    tags: [String],

    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Tshirt', tshirtSchema);