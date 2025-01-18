const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { validateToken } = require('../middleware/auth')
require('dotenv').config();
const {
    resetPassword_req,
    resetPassword
} = require('./reset-password')

// Hai =============================== user routing
// helper ========================================
// hash password ---------------------------------
const hashPassword = async (password) => {
    const passwordHashed = await bcrypt.hash(password, Number(process.env.SALT_ROUND))
    return passwordHashed;
}
// routing =======================================
// Get user infor-----------------------------------
// GET: http://localhost:3001/api/users/profile
router.get('/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user['user'].id;

        const user = await Users.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})
// reset password --------------------------------
router.post('/reset-password', resetPassword_req)
router.post('/reset-password/:token', resetPassword)

// create new user ------------------------------
// POST: http://localhost:3001/api/users/sign-up
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, name, password, avatar } = req.body
        // hash password -------
        const hashpw = (password) ? await hashPassword(password) : null;

        const newUser = await Users.create({
            username,
            email,
            name,
            password: hashpw,
            bio: "",
            phone: "",
            social_link: "",
            company: "",
            location: "",
            avatar: avatar
        })
        return res.json({ success: true, message: "User created successfully!", id: newUser.id });

    } catch (err) {
        let errorList = []
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const errors = err.errors
            errors.map(e => {
                errorList.push(e.message)
                return errorList;
            })
        } else {
            console.log("CREATE USER ERROR !", err)
            errorList.push(err.message)
        }
        return res.status(400).json({
            success: false,
            message: errorList
        })
    }
})
// update user --------------
// PUT: http://localhost:3001/api/users/update-profile
router.put('/update-profile', validateToken,
    async (req, res) => {
        const update = req.body
        try {
            const userId = req.user['user'].id;
            const user = await Users.findByPk(userId);


            await Users.update({
                name: update.name != null ? update.name : user.name,
                bio: update.bio !== null ? update.bio : user.bio,
                phone: update.phone !== null ? update.phone : user.phone,
                social_link: update.social_link !== null ? update.social_link : user.social_link,
                company: update.company !== null ? update.company : user.company,
                location: update.location !== null ? update.location : user.location,
                avatar: update.avatar !== null ? update.avatar : user.avatar,
                email: update.email !== null ? update.email : user.email,
                username: update.username !== null ? update.username : user.username,
                dob: update.dob !== null ? update.dob : user.dob,
            }, { where: { id: userId } });

            return res.json({ message: `User ${userId} updated !`, update: update })
        } catch (err) {

            if (err.name == "SequelizeUniqueConstraintError") return res.status(404).json({ message: "Email or username already exists !" })
            return res.status(404).json({ message: err.message })
        }
    })
// login -------------------------------
// POST: http://localhost:3001/api/users/login?username=hai123&password=123456
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            throw new Error("Username and password can not be empty !")
        }

        const user = await Users.findOne({ where: { username: username } })
        if (!user) { throw new Error("Incorrect username or password.") };

        // compare password -------
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Incorrect username or password.");
        }

        // json web token ---------------
        // file .env : SCRET_KEY = <scret_key>
        const secret_key = process.env.SECRET_KEY
        const token = jwt.sign({ user: { id: user.id, username: user.username, fullname: user.name } }, (secret_key) ? secret_key : "abcd-1234", { expiresIn: process.env.EXPIRED_TOKEN })

        return res.json({ success: true, message: `Login success!`, token: token })
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})


// remove user ---------------------------
// DELETE: http://localhost:3001/api/users/delete/<userID>
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const user = await Users.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User ID:${id} not found !`)
        }
        Users.destroy({
            where: { id }
        })
        return res.json({ message: `User Id:${id} deleted !` })
    } catch (err) {
        return res.status(404).json({ message: err.message })
    }

})
module.exports = router