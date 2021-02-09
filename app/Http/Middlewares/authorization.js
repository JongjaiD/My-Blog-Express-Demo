const db = require("../../../app/Database/connection");
const jwt = require('jsonwebtoken');
const env = require("../../Config/env")

module.exports = async(req, res, next) => {
    try{
        const accessToken = req.headers.authorization
        if(!accessToken){
            return res.status(400).json({
                result:'Fail',
                message: 'have not Token'
            })
        }        
        const decoded = jwt.verify(accessToken, env.JWT_SECRET_KEY);
        const sqlUser =  `SELECT * FROM users WHERE username = '${decoded.user}'` // ` --> use for linking string with variable
        const user = await db.query(sqlUser)
        
        if(!user.length){
            return res.status(401).json({
                result:'Fail',
                message: 'unthorization'
            })
        }
        res.user = user
        next()
        
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            result:'Fail',
            message: error.message
        })
    }
}
