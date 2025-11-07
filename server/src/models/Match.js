const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalRequest',
    required: [true, 'Request ID is required']
  },
  rentalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvailableRental',
    required: [true, 'Rental ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Match score is required'],
    min: 0,
    max: 100
  },
  matchFactors: {
    textSimilarity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    locationProximity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    priceCompatibility: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    categoryMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timingMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'viewed_by_requester', 'viewed_by_owner', 'mutually_viewed', 'rejected', 'accepted'],
    default: 'pending'
  },
  notifiedAt: {
    type: Date,
    default: null
  },
  rejectedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
matchSchema.index({ requestId: 1, score: -1 });
matchSchema.index({ rentalId: 1, score: -1 });
matchSchema.index({ status: 1, createdAt: -1 });
matchSchema.index({ score: -1, createdAt: -1 });

// Unique compound index to prevent duplicate matches
matchSchema.index({ requestId: 1, rentalId: 1 }, { unique: true });

// Virtual for match strength
matchSchema.virtual('strength').get(function() {
  if (this.score >= 80) return 'excellent';
  if (this.score >= 60) return 'good';
  if (this.score >= 40) return 'fair';
  return 'poor';
});

// Virtual for age of match
matchSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Static method to find high-quality matches
matchSchema.statics.findHighQuality = function(minScore = 60) {
  return this.find({
    score: { $gte: minScore },
    status: { $in: ['pending', 'viewed_by_requester', 'viewed_by_owner'] }
  })
  .sort({ score: -1, createdAt: -1 });
};

// Static method to find matches for a request
matchSchema.statics.findByRequest = function(requestId, status = null) {
  const query = { requestId };
  if (status) {
    query.status = status;
  }
  return this.find(query).sort({ score: -1 });
};

// Static method to find matches for a rental
matchSchema.statics.findByRental = function(rentalId, status = null) {
  const query = { rentalId };
  if (status) {
    query.status = status;
  }
  return this.find(query).sort({ score: -1 });
};

// Static method to get mutual matches (both viewed)
matchSchema.statics.findMutual = function() {
  return this.find({
    status: 'mutually_viewed'
  }).sort({ score: -1 });
};

// Instance method to mark as viewed by user
matchSchema.methods.markAsViewed = function(userId) {
  if (this.status === 'pending') {
    this.status = 'viewed_by_requester';
  } else if (this.status === 'viewed_by_requester' || this.status === 'viewed_by_owner') {
    this.status = 'mutually_viewed';
  }
  return this.save();
};

// Instance method to reject match
matchSchema.methods.reject = function(userId) {
  if (!this.rejectedBy.includes(userId)) {
    this.rejectedBy.push(userId);
  }
  this.status = 'rejected';
  return this.save();
};

// Pre-save middleware to validate score
matchSchema.pre('save', function(next) {
  if (this.score < 0 || this.score > 100) {
    return next(new Error('Match score must be between 0 and 100'));
  }

  // Validate match factors sum
  const factorSum = Object.values(this.matchFactors).reduce((sum, value) => sum + value, 0);
  if (factorSum > 100) {
    return next(new Error('Sum of match factors cannot exceed 100'));
  }

  next();
});

module.exports = mongoose.model('Match', matchSchema);