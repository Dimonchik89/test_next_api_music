const { sequelize } = require("../db/models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = ({ id, email, role }) => {
    return jwt.sign(
        { id, email, role },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
    )
}


const register = async (req, res) => {
    const { email, password, role="USER" } = req.body;
    if(!email || !password) {
        return res.status(404).json({ message: "fields are not filled"})
    }

    const oldUser = await sequelize.models.User.findOne({ where: { email }})

    if(oldUser) {
        return res.status(404).json({ message: "User already exist"})
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await sequelize.models.User.create({ email, role, password: encryptedPassword })
    const token = createToken({id: user.id, email, role})

    return res.status(200).json({ token })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if(!email || !password) {
        return res.status(404).json({ message: "fields are not filled"})
    }

    const user = await sequelize.models.User.findOne({ where: { email }})
    
    if(user && (await bcrypt.compare(password, user.password))) {
        const token = createToken({id: user.id, email: user.email, role: user.role})
        return res.status(200).json({ token })
    }

    if(user && !(await bcrypt.compare(password, user.password))) {
        return res.status(404).json({ message: "Not valid password" })
    }
    return res.status(404).json({ message: "User not found"})
}

const auth = async (req, res) => {
    const { id, email, role } = req.user
    const token = createToken({ id, email, role })
    return res.status(200).json({ token })
}


module.exports = {
    register,
    login,
    auth
}