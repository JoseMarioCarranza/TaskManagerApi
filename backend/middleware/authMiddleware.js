const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const user = require('../model/userModel')

const protect = asyncHandler(async (req, res, next) => {

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // obtenemos el token del encabezado
            token = req.headers.authorization.split(" ")[1]

            // verificar que el token sea el correcto
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Obtenemos los datos del usuario desde el id del payload del jwt
            req.user = await user.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error('Acceso no autorizado')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Acceso no autorizado, no se proporciono token')
    }

})

module.exports = {
    protect
}