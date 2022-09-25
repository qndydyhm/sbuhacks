const jwt = require("jsonwebtoken")
const config = require('../config')

function authManager() {
    getUserId = function (token) {
        try {
            if (!token) {
                return 'Guest';
            }
            else {
                const verified = jwt.verify(token, config.JWT_SECRET)
                return verified.userId
            }
        } catch (err) {
            return 'Guest'
        }
    }

    signToken = function (user) {
        return jwt.sign({
            userId: user._id
        }, config.JWT_SECRET, { expiresIn: '1hr' });
    }

    return this;
}

const auth = authManager();
module.exports = auth;