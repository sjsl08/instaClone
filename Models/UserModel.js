const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username:
    {
        type: mongoose.Schema.Types.String,
        required: [true, "name is mandatory"]
    },
    email:
    {
        type: mongoose.Schema.Types.String,
        required: [true, "Email is mandatory"],
        unique: true
    },
    avatar:
    {
        type: mongoose.Schema.Types.String,
        // default: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
    },
    password:
    {
        type: mongoose.Schema.Types.String,
        required: [true, "Password is required"]
    }

}, { versionKey: false })

const User = new mongoose.model("Users", UserSchema)

module.exports = User