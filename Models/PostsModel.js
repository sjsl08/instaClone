const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

let date = new Date()

const UserPosts = new Schema({
    image: {
        type: String,
        required: true
    },
    likes: {
        likes_count: {
            type: Number,
            default: 0
        },
        liked_by:{
            type: Array,
            default:[]
        }
    },
    comment: {
        type: String,
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    Date: {
        type: String,
        default: date.toLocaleString()
    },
    user:
    {
        type: ObjectId,
        ref: "users"
    }

})

module.exports = mongoose.model('User_Posts', UserPosts);

