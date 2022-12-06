const router = require('express').Router()
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/UserModel')
const JWT_auth = require('../MiddleWares/JWT_auth')

router.get("/isloggedin", JWT_auth, async (req, res) => {
    res.status(200).json(req.user)
})

router.post('/signup',
    body('username').isAlphanumeric().isLength({ min: 6, max: 10 }).withMessage('must be at least 6 chars long'),
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be greater than 6 characters"),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // console.log(req.body);
            const { username, email, avatar, password } = req.body

            const existingUser = await User.find({ email: email })

            console.log(existingUser);

            if (existingUser.length) return res.status(400).json({ error: "User with this email already exists." })

            const encryptedPassword = await bcrypt.hash(password, 15)
            const newUser = new User({ username, email, avatar, password: encryptedPassword })

            const successSave = await newUser.save()

            successSave._doc.password = null;

            return res.status(201).json({ ...successSave._doc })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
)

router.post('/login',
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be greater than 6 characters"),
    async (req, res) => {

        try {
            const { email, password } = req.body

            const existingUser = await User.find({ email: email })
            // console.log(existingUser);

            if (existingUser.length === 0) return res.status(400).json({ error: "invalid email or password" })

            // console.log(password, existingUser[0].password);
            const passwordValidation = await bcrypt.compare(password, existingUser[0].password)
            // console.log(passwordValidation);
            if (!passwordValidation) return res.status(400).json({ error: "Invalid Email or Password" })

            const payload = { _id: existingUser[0]._id }
            // console.log(payload);
            const token = jwt.sign(payload, process.env.JWT_MY_SECRET, { expiresIn: "2hrs" })

            existingUser[0].password = undefined
            const user = existingUser[0]
            return res.status(200).json({ token, user })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

module.exports = router