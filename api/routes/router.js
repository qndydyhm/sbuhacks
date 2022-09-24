const express = require('express')
const router = express.Router()
const UserAPI = require('../apis/user-apis')

const test = async(req,res) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("hi")
}

router.post('/login', UserAPI.loginUser)
router.post('/register', UserAPI.registerUser)
router.post('/test', test)

module.exports = router