const User = require('../models/User');
const authService = require('../services/authService');
const logger = require('../utils/logger');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    // Get user from token
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account has been deactivated.'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = authService.verifyAccessToken(token);
      const user = await User.findById(decoded.sub);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Optional auth should not fail the request
    next();
  }
};

// Authorization middleware - check user permissions
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Authentication required.'
      });
    }

    // Check if user is admin (has access to everything)
    if (req.user.isAdmin) {
      return next();
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check email verification
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  if (!req.user.authentication.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required. Please verify your email address.'
    });
  }

  next();
};

// Rate limiting middleware for sensitive operations
const sensitiveOperationRateLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    const key = `${req.user._id}-${req.ip}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(time => time > windowStart);
      attempts.set(key, userAttempts);
    } else {
      attempts.set(key, []);
    }

    const userAttempts = attempts.get(key);

    if (userAttempts.length >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userAttempts.push(now);
    next();
  };
};

// Check if user can access resource
const checkResourceAccess = (resourceModel, resourceIdField = '_id', ownerField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdField];
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Resource ID is required.'
        });
      }

      const Resource = require(`../models/${resourceModel}`);
      const resource = await Resource.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found.'
        });
      }

      // Admin can access everything
      if (req.user.isAdmin) {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource
      if (resource[ownerField].toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You do not have permission to access this resource.'
        });
      }

      req.resource = resource;
      next();

    } catch (error) {
      logger.error('Resource access check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error.'
      });
    }
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  requireEmailVerification,
  sensitiveOperationRateLimit,
  checkResourceAccess
};