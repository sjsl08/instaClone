const mongoose = require('mongoose')

const connect_to_DB = () => {
    return mongoose.connect("mongodb+srv://sjsl:sjsl@cluster0.yjzwy8l.mongodb.net/Instagram?retryWrites=true&w=majority")
        .then(() => { console.log("DB Connect!!!!!"); })
        .catch((err) => { console.log(err); })
}

module.exports = connect_to_DB