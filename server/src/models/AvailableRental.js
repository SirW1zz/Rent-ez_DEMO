const mongoose = require('mongoose');

const availableRentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'electronics', 'furniture', 'vehicles', 'tools', 'books',
      'games', 'clothing', 'sports', 'outdoor', 'home',
      'office', 'photography', 'music', 'party', 'other'
    ]
  },
  images: [{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.startsWith('https://res.cloudinary.com/');
      },
      message: 'Images must be Cloudinary URLs'
    }
  }],
  pricing: {
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: [0, 'Rate cannot be negative']
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      enum: ['hour', 'day', 'week', 'month']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP', 'INR']
    },
    deposit: {
      type: Number,
      min: [0, 'Deposit cannot be negative'],
      default: 0
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  condition: {
    state: {
      type: String,
      required: [true, 'Condition state is required'],
      enum: ['new', 'like-new', 'good', 'fair', 'poor']
    },
    description: {
      type: String,
      maxlength: [1000, 'Condition description cannot exceed 1000 characters']
    },
    images: [{
      type: String,
      validate: {
        validator: function(v) {
          return v.startsWith('https://res.cloudinary.com/');
        },
        message: 'Condition images must be Cloudinary URLs'
      }
    }]
  },
  availability: {
    availableFrom: {
      type: Date,
      required: [true, 'Available from date is required']
    },
    availableTo: {
      type: Date,
      required: [true, 'Available to date is required']
    },
    minimumRentalPeriod: {
      type: Number,
      default: 1,
      min: [1, 'Minimum rental period must be at least 1']
    },
    maximumRentalPeriod: {
      type: Number,
      default: 365,
      min: [1, 'Maximum rental period must be at least 1']
    },
    leadTime: {
      type: Number,
      default: 0,
      min: [0, 'Lead time cannot be negative']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates format'
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    deliveryOptions: {
      pickup: {
        type: Boolean,
        default: true
      },
      delivery: {
        type: Boolean,
        default: false
      },
      deliveryFee: {
        type: Number,
        min: [0, 'Delivery fee cannot be negative'],
        default: 0
      },
      deliveryRadius: {
        type: Number,
        min: [1, 'Delivery radius must be at least 1 km'],
        default: 10
      }
    }
  },
  specifications: {
    brand: {
      type: String,
      trim: true
    },
    model: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be more than one year in the future']
    },
    dimensions: {
      type: String,
      trim: true
    },
    weight: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    material: {
      type: String,
      trim: true
    },
    features: [{
      type: String,
      trim: true
    }],
    accessories: [{
      type: String,
      trim: true
    }]
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'unavailable', 'cancelled'],
    default: 'available'
  },
  stats: {
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    inquiryCount: {
      type: Number,
      default: 0,
      min: 0
    },
    rentalCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geospatial index for location-based queries
availableRentalSchema.index({ 'location.coordinates': '2dsphere' });

// Compound indexes for common queries
availableRentalSchema.index({ userId: 1, status: 1 });
availableRentalSchema.index({ category: 1, status: 1 });
availableRentalSchema.index({ featured: 1, status: 1 });
availableRentalSchema.index({ 'availability.availableFrom': 1, 'availability.availableTo': 1 });

// Text search index
availableRentalSchema.index({
  title: 'text',
  description: 'text',
  'specifications.brand': 'text',
  'specifications.model': 'text',
  tags: 'text'
});

// Virtual for checking if rental is currently available
availableRentalSchema.virtual('isCurrentlyAvailable').get(function() {
  const now = new Date();
  return this.status === 'available' &&
         this.availability.availableFrom <= now &&
         this.availability.availableTo >= now;
});

// Virtual for daily rate conversion
availableRentalSchema.virtual('dailyRate').get(function() {
  const rates = {
    hour: this.pricing.rate * 24,
    day: this.pricing.rate,
    week: this.pricing.rate / 7,
    month: this.pricing.rate / 30
  };
  return rates[this.pricing.period] || this.pricing.rate;
});

// Pre-save middleware to validate dates
availableRentalSchema.pre('save', function(next) {
  if (this.availability.availableFrom >= this.availability.availableTo) {
    return next(new Error('Available to date must be after available from date'));
  }

  if (this.availability.minimumRentalPeriod > this.availability.maximumRentalPeriod) {
    return next(new Error('Minimum rental period cannot be greater than maximum'));
  }

  // Validate delivery options
  if (this.location.deliveryOptions.delivery &&
      (!this.location.deliveryOptions.deliveryFee ||
       !this.location.deliveryOptions.deliveryRadius)) {
    return next(new Error('Delivery options require both fee and radius'));
  }

  next();
});

// Static method to find available rentals
availableRentalSchema.statics.findAvailable = function() {
  const now = new Date();
  return this.find({
    status: 'available',
    'availability.availableFrom': { $lte: now },
    'availability.availableTo': { $gte: now }
  });
};

// Static method to find rentals near a location
availableRentalSchema.statics.findNear = function(coordinates, maxDistance = 50000) {
  return this.findAvailable({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Static method to find featured rentals
availableRentalSchema.statics.findFeatured = function(limit = 10) {
  return this.findAvailable({ featured: true })
    .sort({ 'stats.viewCount': -1, createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('AvailableRental', availableRentalSchema);