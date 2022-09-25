const express = require('express')
const router = express.Router()
const UserAPI = require('../apis/user-apis')
const ForumAPI = require('../apis/forum-apis')

router.post('/login', UserAPI.loginUser)
router.post('/register', UserAPI.registerUser)
router.get('/logout', UserAPI.logoutUser)


router.post('/postthread', ForumAPI.postThread)
router.post('/postcomment', ForumAPI.postComment)
router.get('/getcookthreadList',ForumAPI.getCookThreadList);
router.get('/geteatthreadList',ForumAPI.getEatThreadList);
router.get('/getthread',ForumAPI.getThread);
router.get('/searchcookthread',ForumAPI.searchCookThread);
router.get('/searcheatthread',ForumAPI.searchEatThread);


module.exports = router