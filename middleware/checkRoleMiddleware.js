const jwt = require("jsonwebtoken");

const checkRoleMiddleware = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token) {
            return res.status(401).json({ message: "Not authorized"})
        }
        const decode = jwt.verify(token, process.env.TOKEN_KEY)
        if(decode.role !== "ADMIN") {
            return res.status(403).json({message: "No access"})
        }
        req.user = decode;
        next()
    } catch(e) {
        return res.status(401).json({ message: "Not authorized"})
    }
}

module.exports = { checkRoleMiddleware }