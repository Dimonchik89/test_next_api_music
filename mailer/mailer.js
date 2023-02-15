const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_KEY
    }
})

const SENDMAIL = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails)
        callback(info);
    } catch(e) {
        console.log(e);
    }
}

module.exports = SENDMAIL