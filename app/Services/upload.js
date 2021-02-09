const path = require("path")
module.exports = {
    upload : async (req , key, folder='avatars') => {
     
        const file = req[key]
        const type = file.mimetype.split('/').pop()
        const fileName = `${+ new Date()}.${type}`
        const pathFile = `public/uploads/${folder}/${fileName}`
        const uploadUrl =  path.resolve(pathFile)
        // const url = `${env.APP_URL}/static/uploads/${fileName}`

        return new Promise((resolve, reject) => {
            file.mv(uploadUrl, (err) => {
                if (err) return reject(err)
                return resolve(fileName)
            }) 
        })  
    }
}
    
