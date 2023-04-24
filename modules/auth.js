import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export function genToken(user) {
    const token = jwt.sign({ username: user.username }, process.env.SECRET, {expiresIn: "1d"})

    return token
}

export function checkToken(req, res, next) {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: "No token provided." })
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." })
        } else {
            req.user = decoded.username
            next()
        }
    })
}

export function wsCheckToken(socket, next) {
    const token = socket.handshake.auth.token

    if (!token) {
        return next(new Error('Authentication error: token not provided'))
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: invalid token'));
        } else {
            socket.user = decoded.username
            next()
        }
    })
}