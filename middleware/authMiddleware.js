const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // If token was issued as refresh token, reject it for protected routes.
    // (Older tokens may not include `type`; in that case we allow.)
    if (decoded?.type && decoded.type !== 'access') {
      return res.status(401).json({ success: false, message: 'Token is invalid or expired' })
    }

    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is invalid or expired' })
  }
}

module.exports = { protect }