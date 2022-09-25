const express = require('express')
const router = express.Router()
const UserAPI = require('../apis/user-apis')

router.post('/login', UserAPI.loginUser)
router.post('/register', UserAPI.registerUser)

module.exports = router