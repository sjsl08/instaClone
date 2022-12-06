const router = require("express").Router()
const JWT_auth = require("../MiddleWares/JWT_auth");
const Posts = require("../Models/PostsModel")


router.post("/createPost", JWT_auth, async (req, res) => {
    // console.log(req.body);
    const { image, location, description, user } = req.body
    try {
        const new_post = new Posts({ image, location, description, user })
        const result = await new_post.save()
        res.status(200).json({ res: result })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})


router.get("/feed/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const result = await Posts.find({ user: { $ne: req.params.id } })
        console.log(result);
        res.status(200).json({ UserPosts: result })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get("/myposts/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const result = await Posts.find({ user: req.params.id })
        console.log(result);
        res.status(200).json({ UserPosts: result })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.put("/feed/:id", JWT_auth, async (req, res) => {
    // console.log(req.params.id);
    const { user_id } = req.body
    try {

        const post = await Posts.find({ _id: req.params.id })
        // console.log(post[0]);
        const liked = post[0].likes.liked_by.includes(user_id)
        console.log(liked);
        if (!liked) {
            const result = await Posts.updateOne({ _id: req.params.id }, { $inc: { "likes.likes_count": 1 } })
            const updatedArray = await Posts.updateOne({ _id: req.params.id },
                { $push: { "likes.liked_by": user_id } })
        }
        else {
            const result = await Posts.updateOne({ _id: req.params.id }, { $inc: { "likes.likes_count": -1 } })
            const newArray = post[0].likes.liked_by.filter((elem) => { return (elem != user_id) })
            const updatedArray = await Posts.updateMany({ "likes.liked_by": newArray })
            // { $push: { "likes.liked_by": user_id } })
        }
        res.status(200).json({ UserPosts: result })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})






module.exports = router;