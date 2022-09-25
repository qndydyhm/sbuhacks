const express = require('express')
const router = express.Router()
const UserAPI = require('../apis/user-apis')

router.post('/login', UserAPI.loginUser)
router.post('/register', UserAPI.registerUser)
router.get('/logout', UserAPI.logoutUser)

module.exports = router