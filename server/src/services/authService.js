const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthService {
  // Generate JWT tokens
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { sub: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Register new user with email/password
  async registerUser(userData) {
    const { email, name, password, phone } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      name: name.trim(),
      password,
      phone,
      authentication: {
        provider: 'email',
        isEmailVerified: false
      }
    });

    // Generate email verification token
    const verificationToken = jwt.sign(
      { sub: user._id, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    user.emailVerificationToken = verificationToken;
    await user.save();

    logger.info(`New user registered: ${user.email}`);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isEmailVerified: user.authentication.isEmailVerified,
        profileCompletion: user.profileCompletion
      },
      verificationToken,
      ...this.generateTokens(user._id)
    };
  }

  // Login user with email/password
  async loginUser(email, password) {
    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account has been deactivated');
    }

    // Verify password
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await user.updateLastLogin();

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        isEmailVerified: user.authentication.isEmailVerified,
        profileCompletion: user.profileCompletion,
        isAdmin: user.isAdmin
      },
      ...this.generateTokens(user._id)
    };
  }

  // Find or create user from Google OAuth
  async findOrCreateGoogleUser(googleProfile) {
    const { id: googleId, emails, name, photos } = googleProfile;
    const email = emails[0].value;
    const fullName = `${name.givenName} ${name.familyName}`;
    const avatar = photos[0]?.value;

    let user = await User.findOne({
      $or: [
        { email },
        { 'authentication.providerId': googleId }
      ]
    });

    if (!user) {
      // Create new user from Google profile
      user = new User({
        email,
        name: fullName,
        avatar,
        authentication: {
          provider: 'google',
          providerId: googleId,
          isEmailVerified: true // Google emails are pre-verified
        }
      });

      logger.info(`New Google user created: ${email}`);
    } else {
      // Update existing user with Google info
      if (user.authentication.provider !== 'google') {
        user.authentication.provider = 'google';
        user.authentication.providerId = googleId;
        user.authentication.isEmailVerified = true;
      }

      // Update avatar if not set
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }

      logger.info(`Google user logged in: ${email}`);
    }

    // Update last login
    await user.updateLastLogin();

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        isEmailVerified: user.authentication.isEmailVerified,
        profileCompletion: user.profileCompletion,
        isAdmin: user.isAdmin
      },
      ...this.generateTokens(user._id)
    };
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid verification token');
      }

      const user = await User.findById(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.authentication.isEmailVerified) {
        return { success: true, message: 'Email already verified' };
      }

      user.authentication.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();

      logger.info(`Email verified: ${user.email}`);

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists
      return { success: true, message: 'If an account exists, a reset link has been sent' };
    }

    const resetToken = jwt.sign(
      { sub: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    logger.info(`Password reset requested: ${email}`);

    // TODO: Send email with reset link
    return { success: true, message: 'If an account exists, a reset link has been sent' };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid reset token');
      }

      const user = await User.findById(decoded.sub);
      if (!user || !user.passwordResetToken || user.passwordResetExpires < Date.now()) {
        throw new Error('Invalid or expired reset token');
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      logger.info(`Password reset completed: ${user.email}`);

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    return this.generateTokens(user._id);
  }
}

module.exports = new AuthService();