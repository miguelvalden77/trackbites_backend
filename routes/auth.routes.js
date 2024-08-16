const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
// const isAuth = require("../middlewares/isAuth")

router.post("/signup", async (req, res, next) => {

    const { username, email, password } = req.body
    const usernameOk = username.toLowerCase().trim()

    if (!username || !email || !password) {
        res.status(400).json({ errorMessage: "Debes rellenar todos los campos" })
        return
    }

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    if (passwordRegex.test(password) === false) {
        res.status(400).json({ errorMessage: "La contraseña debe contener al menos 1 minúscula, 1 mayúscula y 1 número" })
        return
    }

    try {

        const foundUser = await User.findOne({ $or: [{ username: usernameOk }, { email }] })

        if (foundUser) {
            res.status(400).json({ errorMessage: "Credenciales ya registradas" })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await User.create({ username: usernameOk, email, password: hashedPassword })
        res.json("Usuario creado")
    }
    catch (error) {
        next(error)
    }

})

router.post("/login", async (req, res, next) => {

    const { username, password } = req.body
    const usernameOk = username.toLowerCase().trim()

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    if (passwordRegex.test(password) === false) {
        res.status(400).json({ errorMessage: "La contraseña debe contener al menos 1 minúscula, 1 mayúscula y 1 número" })
        return
    }

    if (!username || !password) {
        res.status(400).json({ errorMessage: "Debes rellenar todos los campos" })
        return
    }

    try {
        const foundUser = await User.findOne({ username: usernameOk })
        if (foundUser === null) {
            res.status(400).json({ errorMessage: "No hay ningún usuario con ese username" })
            return
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        if (!isPasswordValid) {
            res.status(400).json({ errorMessage: "Contraseña incorrecta" })
            return
        }

        const payload = {
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email
        }

        const authToken = jwt.sign(payload, process.env.SECRET_KEY, { algorithm: "HS256", expiresIn: "4h" })

        res.json({ authToken: authToken })
    }
    catch (error) {
        next(error)
    }

})

// router.get("/verify", isAuth, async (req, res, next) => {
//     try {
//         res.json(req.payload)
//     }
//     catch (error) {
//         next(error)
//     }
// })


module.exports = router