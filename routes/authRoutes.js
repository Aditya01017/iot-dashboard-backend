const express = require('express')
const router = express.Router()

const { register, login, forgotPassword, resetPassword, getMe, updateMe } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)

module.exports = router