const HTML_TEMPLATE = require("../mailer/mail-template")
const SENDMAIL = require('../mailer/mailer')

const sendEmail = async (req, res) => {
    const {link} = req.body;

    if(!link) {
        return res.status(404).json({message: "Need add link"})
    }

    const message = "User downloaded your music"
    const options = {
        from: "TuneBox",
        to: process.env.EMAIL,
        subject: "New download",
        text: message,
        html: HTML_TEMPLATE(link),
    }
    SENDMAIL(options, (info) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", info.messageId);
    });
    return res.json({message: "Email send"})
}

module.exports = sendEmail