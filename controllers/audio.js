const { sequelize, Sequelize } = require("../db/models/index")
const Op = Sequelize.Op;
const uuid = require("uuid")
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")

const create = async (req, res) => {
    try {
        const {name, categoryId, keywords, description} = req.body
        const {audio, img} = req.files
        const audioExtension = audio.name.split(".").pop()
        const imgExtension = img.name.split(".").pop()
        
        const audioName = uuid.v4() + `.${audioExtension}`
        const imgName = uuid.v4() + `.webp`

        const audioPath = path.resolve(__dirname, "..", "static/music/audio")
        const imgPath = path.resolve(__dirname, "..", "static/music/logo")
        const keywordsArr =keywords.split(",")?.map(item => item.trim())

        if(!fs.existsSync(audioPath)) {
            fs.mkdirSync(audioPath, {recursive: true})
        }
        if(!fs.existsSync(imgPath)) {
            fs.mkdirSync(imgPath, { recursive: true})
        }
        audio.mv(path.resolve(__dirname, "..", "static/music/audio", audioName))
        // img.mv(path.resolve(__dirname, "..", "static/music/logo", imgName))
        await sharp(img.data)
            .resize({
                width: 320,
                height: 240
            })
            .toFormat('webp')
            .toFile(path.resolve(__dirname, "..", "static/music/logo", imgName))

        const music = await sequelize.models.Audio.create({name, categoryId, keywords: keywordsArr, description, audio: `music/audio/${audioName}`, img: `music/logo/${imgName}`})
        return res.json(music)
    } catch(e) {
        return res.status(404).json({message: e})
    }
}

const getAll = async (req, res) => {
    try {
        let {categoryId, keywords, limit, page} = req.query
        // const lookupValue = keywords?.toLowerCase()

        page = page || 1
        limit = limit || 9
        const offset = page * limit - limit
        let audio;

        if(categoryId && !keywords) {
            audio = await sequelize.models.Audio.findAndCountAll({where: { categoryId: {[Op.like]: `%${categoryId}%`}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
        } if(!categoryId && keywords) {
            const keywordsArr = keywords.trim().split(" ")
                ?.map(item => item.trim().replace(",", "").toLowerCase())
                ?.filter(item => item != "")
            audio = await sequelize.models.Audio.findAndCountAll({where: { keywords: {[Op.contains]: keywordsArr}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
        } if(categoryId && keywords) {
            const keywordsArr = keywords.trim().split(" ")
                ?.map(item => item.trim().replace(",", "").toLowerCase())
                ?.filter(item => item != "")
            audio = await sequelize.models.Audio.findAndCountAll({where: { keywords: {[Op.contains]: keywordsArr}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
        } if(!categoryId && !keywords) {
            // audio = await sequelize.models.Audio.findAndCountAll({limit, offset})
            audio = await sequelize.models.Audio.findAndCountAll({limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
        }
        return res.json(audio)
    } catch(e) {
        console.error(`\n [Audio controller] Error \n`, e)
    }
    //     let {categoryId, keywords, limit, page} = req.query
    //     // const lookupValue = keywords?.toLowerCase()

    //     page = page || 1
    //     limit = limit || 9
    //     const offset = page * limit - limit
    //     let audio;

    //     if(categoryId && !keywords) {
    //         audio = await sequelize.models.Audio.findAndCountAll({where: { categoryId: {[Op.like]: `%${categoryId}%`}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
    //     } if(!categoryId && keywords) {
    //         const keywordsArr = keywords.trim().split(" ")
    //             ?.map(item => item.trim().replace(",", "").toLowerCase())
    //             ?.filter(item => item != "")
    //         audio = await sequelize.models.Audio.findAndCountAll({where: { keywords: {[Op.contains]: keywordsArr}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
    //     } if(categoryId && keywords) {
    //         const keywordsArr = keywords.trim().split(" ")
    //             ?.map(item => item.trim().replace(",", "").toLowerCase())
    //             ?.filter(item => item != "")
    //         audio = await sequelize.models.Audio.findAndCountAll({where: { keywords: {[Op.contains]: keywordsArr}}, limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
    //     } if(!categoryId && !keywords) {
    //         // audio = await sequelize.models.Audio.findAndCountAll({limit, offset})
    //         audio = await sequelize.models.Audio.findAndCountAll({limit, offset, order: [ [ 'createdAt', 'DESC' ]]})
    //     }
    // return res.json(audio)
}

const deleteAudio = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.json({message: "Id is not defined"})
    }
    const audio = await sequelize.models.Audio.findOne({where: { id }})

    if(!audio) {
        return res.json({message: "Audio is not defined"})
    }

    try {
        fs.unlink(path.resolve(__dirname, "..", "static", audio.audio), async err => {
        if(err) throw err
        fs.unlink(path.resolve(__dirname, "..", "static", audio.img), async err => {
            const deletedAudio = await sequelize.models.Audio.destroy({where: { id }})
            return res.json({message: `Track ${id} delete`})
            })
        })
    } catch(e) {
        throw new Error(e)
    }
}

const update = async (req, res) => {
    try {
        const {id} = req.params
        const { keywords, ...tailData} = req.body
        const keywordsArr = keywords.split(",")?.map(item => item.trim())
        let audio;
        let img;
        if(req.files) {
            audio = req?.files?.audio;
            img = req?.files?.img
        }

        if(!id) {
            return res.json({message: "Id is not defined"})
        }
        const oldAudio = await sequelize.models.Audio.findOne({where: { id }})

        if(!oldAudio) {
            return res.json({message: "Song is not defined"})
        }
    
        if(img && !audio) {
            // const imgExpension = img.name.split(".").pop()
            const imgName = uuid.v4() + `.webp`
            fs.unlink(path.resolve(__dirname, "..", "static", oldAudio.img), async err => {
                if(err) throw err
                img.mv(path.resolve(__dirname, "..", "static/music/logo", imgName))
                await sharp(img.data)
                    .resize({
                        width: 320,
                        height: 240
                    })
                    .toFormat('webp')
                    .toFile(path.resolve(__dirname, "..", "static/music/logo", imgName))
                const Audio = await sequelize.models.Audio.update({...tailData, keywordsArr, img: `music/logo/${imgName}`}, {where: { id }})
                const newAudio = await sequelize.models.Audio.findOne({ where: { id }})
                return res.json(newAudio)
            })

        } if(!img && audio) {
            const audioExtension = audio.name.split(".").pop()
            const audioName = uuid.v4() + `.${audioExtension}`

            fs.unlink(path.resolve(__dirname, "..", "static", oldAudio.audio), async err => {
                if(err) throw err
                audio.mv(path.resolve(__dirname, "..", "static/music/audio", audioName))
                const Audio = await sequelize.models.Audio.update({...tailData, keywordsArr, audio: `music/audio/${audioName}`}, {where: { id }})
                const newAudio = await sequelize.models.Audio.findOne({ where: { id }})
                return res.json(newAudio)
            })

        } if(img && audio) {
            const audioExtension = audio.name.split(".").pop()
            // const imgExtension = img.name.split(".").pop()

            const audioName = uuid.v4() + `.${audioExtension}`
            const imgName = uuid.v4() + `.webp`

            fs.unlink(path.resolve(__dirname, "..", "static", oldAudio.audio), async err => {
                if(err) throw err
                audio.mv(path.resolve(__dirname, "..", "static/music/audio", audioName))
                fs.unlink(path.resolve(__dirname, "..", "static", oldAudio.img), async err => {
                    if(err) throw err
                    // img.mv(path.resolve(__dirname, "..", "static/music/logo", imgName))
                    await sharp(img.data)
                        .resize({
                            width: 320,
                            height: 240
                        })
                        .toFormat('webp')
                        .toFile(path.resolve(__dirname, "..", "static/music/logo", imgName))

                    const Audio = await sequelize.models.Audio.update({...tailData, keywordsArr, audio: `music/audio/${audioName}`, img: `music/logo/${imgName}`}, {where: { id }})
                    const newAudio = await sequelize.models.Audio.findOne({ where: { id }})
                    return res.json(newAudio)
                })
            })
        } if(!img && !audio) {
            const Audio = await sequelize.models.Audio.update({...tailData, keywordsArr}, {where: { id }})
            const newAudio = await sequelize.models.Audio.findOne({ where: { id }})
            return res.json(newAudio)
        }
    } catch(e) {
        throw new Error(e)
    }

} 

const download = async (req, res) => {
    try {
        const {filename} = req.query
        const pathToSharedDirectory = path.resolve(__dirname, "..", "static")
        const filePath = pathToSharedDirectory + '/' + filename
        if(fs.existsSync(filePath))
        // return res.download(filePath, (err) => {
        //     console.log('err', err)
        // });
        return res.download(filePath);
    } catch(e) {
        return res.status(500).json({message: "Download error"})
    }

}

module.exports = {
    create,
    getAll,
    deleteAudio,
    update,
    download
}