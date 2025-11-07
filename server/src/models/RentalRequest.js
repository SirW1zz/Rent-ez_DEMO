const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
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
    validate: {
      validator: function(v) {
        return v.startsWith('https://res.cloudinary.com/');
      },
      message: 'Images must be Cloudinary URLs'
    }
  }],
  budget: {
    min: {
      type: Number,
      min: [0, 'Minimum budget cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      enum: ['USD', 'EUR', 'GBP', 'INR']
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  rentalPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    duration: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months'],
      required: [true, 'Duration type is required']
    },
    flexible: {
      type: Boolean,
      default: false
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
    searchRadius: {
      type: Number,
      default: 10,
      min: [1, 'Search radius must be at least 1 km'],
      max: [500, 'Search radius cannot exceed 500 km']
    }
  },
  preferences: {
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'any'],
      default: 'any'
    },
    delivery: {
      type: Boolean,
      default: false
    },
    pickup: {
      type: Boolean,
      default: true
    },
    urgency: {
      type: String,
      enum: ['immediate', 'week', 'month', 'flexible'],
      default: 'flexible'
    },
    additionalRequirements: {
      type: String,
      maxlength: [1000, 'Additional requirements cannot exceed 1000 characters']
    }
  },
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'expired', 'cancelled'],
    default: 'active'
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  contactCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  expiresAt: {
    type: Date,
    default: function() {
      // Default expiry 30 days from creation
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geospatial index for location-based queries
rentalRequestSchema.index({ 'location.coordinates': '2dsphere' });

// Compound indexes for common queries
rentalRequestSchema.index({ userId: 1, status: 1 });
rentalRequestSchema.index({ category: 1, status: 1 });
rentalRequestSchema.index({ expiresAt: 1, status: 1 });
rentalRequestSchema.index({ 'rentalPeriod.startDate': 1, 'rentalPeriod.endDate': 1 });

// Text search index
rentalRequestSchema.index({
  title: 'text',
  description: 'text',
  'preferences.additionalRequirements': 'text',
  tags: 'text'
});

// Virtual for checking if request is expired
rentalRequestSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Virtual for rental duration in days
rentalRequestSchema.virtual('durationInDays').get(function() {
  const msInDay = 24 * 60 * 60 * 1000;
  return Math.ceil((this.rentalPeriod.endDate - this.rentalPeriod.startDate) / msInDay);
});

// Pre-save middleware to validate dates
rentalRequestSchema.pre('save', function(next) {
  if (this.rentalPeriod.startDate >= this.rentalPeriod.endDate) {
    return next(new Error('End date must be after start date'));
  }

  if (this.rentalPeriod.startDate < new Date()) {
    return next(new Error('Start date cannot be in the past'));
  }

  // Validate budget range
  if (this.budget.min && this.budget.max && this.budget.min > this.budget.max) {
    return next(new Error('Maximum budget cannot be less than minimum budget'));
  }

  next();
});

// Static method to find active requests
rentalRequestSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

// Static method to find requests near a location
rentalRequestSchema.statics.findNear = function(coordinates, maxDistance = 50000) {
  return this.findActive({
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

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);