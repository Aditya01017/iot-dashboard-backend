const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN 
  })
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' })

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already exists' })

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email } } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing credentials' })

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)
    res.status(200).json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email } } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ success: false, message: 'There is no user with that email' })

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    console.log(`[SECURE SIMULATED EMAIL SENT] User Link Token: ${resetToken}`)

    res.status(200).json({ success: true, message: 'Email realistically simulated and token generated.' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email could not be generated.' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) return res.status(400).json({ success: false, message: 'Invalid token' })

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    const token = generateToken(user._id)
    res.status(200).json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email } } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user })
}

const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name: req.body.name }, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { register, login, forgotPassword, resetPassword, getMe, updateMe }