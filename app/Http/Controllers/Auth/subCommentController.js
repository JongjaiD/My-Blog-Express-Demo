const Validete = require("../../../Services/validate");
const db = require("../../../Database/connection");
const at = require("../../../Helper/index");

module.exports = {
    create: async(req, res) => {
        try{
            const rules = {
                comment_id: 'require|number',
                message: 'require'
            }
            await Validete(req.body, rules)
            
            const values = {
                user_id: res.user[0].id,
                comment_id: req.body.comment_id,
                message: req.body.message,
                created_at: at.now(),
                updated_at: at.now()
            }
    
            const sqlInsertSubComment = "INSERT INTO sub_comments SET?"
            const data = await db.query(sqlInsertSubComment, values)
            console.log(data)

            const sqlSelectSubComment =  `SELECT * FROM sub_comments WHERE id = '${data.insertId}'` // ` --> use for linking string with variable
            const subComment = await db.query(sqlSelectSubComment)
            console.log(subComment)



            return res.status(200).json({
                result:'Success',
                subComment
            })
        }
        catch(error){
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    },


    update: async(req, res) => {
        try{
            const rules = {
                sub_comment_id: 'require',
                message: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const subCommentId = req.body.sub_comment_id
            const sqlSelectSubComment =  `SELECT id FROM sub_comments WHERE id = '${subCommentId}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const subComment = await db.query(sqlSelectSubComment)
            if(!subComment.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }
            
            const message = req.body.message
            const sqlUpdateSubComment = `UPDATE sub_comments SET message = '${message}', updated_at = '${at.now()}' WHERE id = '${subCommentId}'`
            const updateSubComment = await db.query(sqlUpdateSubComment)
            let messageAlert = 'Successfully Updated'
            if(!updateSubComment.affectedRows){
                messageAlert = 'Fail update'
            }

            return res.status(200).json({
                result:'Success',
                message: messageAlert
            })
        }
        catch(error){
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    },

    delete: async(req, res) => {
        try{
            const rules = {
                sub_comment_id: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const subCommentId = req.body.sub_comment_id
            const sqlDeleteSubComment =  `SELECT id FROM sub_comments WHERE id = '${subCommentId}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const subComment = await db.query(sqlDeleteSubComment)
            if(!subComment.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }

            const sqlUpdateDelete = `UPDATE sub_comments SET deleted_at = '${at.now()}' WHERE id = '${subCommentId}'`
            const updateDelete = await db.query(sqlUpdateDelete)
            let message = 'Successfully Deleted'
            if(!updateDelete.affectedRows){
                message = 'Fail delete'
            }


            return res.status(200).json({
                result:'Success',
                message
            })
        }
        catch(error){
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    }
}