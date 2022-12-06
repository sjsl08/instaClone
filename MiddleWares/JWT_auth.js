const jwt = require("jsonwebtoken")

const User = require("../Models/UserModel")

module.exports = (req, res, next) => {

    const AuthHeader = req.headers.authorization
    console.log(AuthHeader);

    if (AuthHeader) {
        const token = AuthHeader.split(" ")[1]
        console.log(token);
        jwt.verify(token, process.env.JWT_MY_SECRET, async (err, payload) => {
            if (err) {
                console.log(err);
                return res.status(401).json({ error: "Not Authorized" })
            }

            try {
                const user = await User.find({ _id: payload._id }).select("-password")
                req.user = user
                next()
            } catch (error) {
                console.log(error);
            }

        })
    } else {
        res.status(403).json({ message: "Forbidden" })
    }
}