const mongoose = require('mongoose')
const config = require('../config')

mongoose
    .connect(config.mongoURL, { 
        authsource: 'admin',
        user: config.mongoUser,
        pass: config.mongoPassword,
        useNewUrlParser: true, 
    })
    .then(() => {
        console.log('Connected to database')
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db