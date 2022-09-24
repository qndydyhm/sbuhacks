#!/usr/bin/env node
const express = require('express')
const PORT = 4000
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: ["http://127.0.0.1:3000", "http://localhost:3000", "*"],
//     credentials: true
// }))

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

const router = require('./routes/router')
app.use('/api', router)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
