
//! imports
const express = require('express')
const morgan = require('morgan')
const connect_to_DB = require('./DB Config/DB')
const JWT_auth = require('./MiddleWares/JWT_auth')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require("path")
dotenv.config()
//! xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//! Middlewares
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(morgan('tiny'))

//! xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


//! routes

app.use('/apiV1', require('./Routes/auth'))
app.use('/apiV1', require('./Routes/Posts'))

app.get('/try', JWT_auth, (req, res) => {
    res.status(200).json({ user: req.user })
})

//? path

app.use(express.static(path.join(__dirname, "./Client/build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Client/build/index.html"))
})

//! xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx




//! DB Connection

let PORT = process.env.PORT || 3008

app.listen(PORT, async () => {
    try {
        await connect_to_DB()
        console.log(`Server up at ${PORT}`);
    } catch (error) {
        console.log(error);
    }
})