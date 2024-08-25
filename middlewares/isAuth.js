const { expressjwt } = require("express-jwt")

const isAuth = expressjwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: (req) => {

        if (req.headers === undefined || req.headers.authorization === undefined) {
            console.log("No hay token")
            return null
        }

        const tokenArr = req.headers.authorization.split(" ")
        const token = tokenArr[1]
        const tokenType = tokenArr[0]

        if (tokenType !== "Bearer") {
            console.log("tipo de token inválido")
            return null
        }

        return token
    }
})

module.exports = isAuth