const Validete = require("../../../Services/validate");
const db = require("../../../Database/connection");
const Tag = require("../../../Services/createTag");

module.exports = {
    create: async(req, res) => {
        try{
            const rules = {
                tags: 'require'
            }
            await Validete(req.body, rules)
            await Tag(16 ,req.body.tags)
        
            

            return res.status(200).json({
                result:'Success',
            })
        }

        catch(error){
            console.log(error)
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    }
}