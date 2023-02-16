const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
require("dotenv").config();
const router = require("./routes");
const path = require("path")
const fileUpload = require("express-fileupload");
const { sequelize } = require("./db/models/index")
var cors_proxy = require('cors-anywhere');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload({}))
app.use(cors({
    origin: process.env.SITE_URL,
    credentials: false 
}))
// app.use(cors({ origin: "http://localhost:3000/", credentials: false }))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`);
        })
    } catch(e) {
        console.log(e);
    }
}

start()