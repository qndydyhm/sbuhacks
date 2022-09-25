const express = require('express')
const router = express.Router()
const UserAPI = require('../apis/user-apis')
const ForumAPI = require('../apis/forum-apis')

router.post('/login', UserAPI.loginUser)
router.post('/register', UserAPI.registerUser)
router.get('/logout', UserAPI.logoutUser)


router.post('/postthread', ForumAPI.postThread)
router.get('/getCookThreadList',ForumAPI.getCookThreadList);
router.get('/getEatThreadList',ForumAPI.getEatThreadList);
router.get('getThread',ForumAPI.getThread);
router.search('/searchCookThread',ForumAPI.searchCookThread);
router.search('/searchEatThread',ForumAPI.searchEatThread);


module.exports = router