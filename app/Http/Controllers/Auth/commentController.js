const Validete = require("../../../Services/validate");
const db = require("../../../Database/connection");
const at = require("../../../Helper/index");

module.exports = {
    create: async(req, res) => {
        try{
            const rules = {
                post_id: 'require|number',
                message: 'require'
            }
            await Validete(req.body, rules)

            const values = {
                user_id: res.user[0].id,
                post_id: req.body.post_id,
                message: req.body.message,
                created_at: at.now(),
                updated_at: at.now()
            }
            const sqlInsert = "INSERT INTO comments SET?"
            const data = await db.query(sqlInsert, values)
            
            const sqlSelect =  `SELECT * FROM comments WHERE id = '${data.insertId}'` 
            const comment = await db.query(sqlSelect)


            return res.status(200).json({
                result:'Success',
                comment
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
                comment_id: 'require',
                message: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const comment_id = req.body.comment_id
            const sqlSelectComment =  `SELECT id FROM comments WHERE id = '${comment_id}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const comment = await db.query(sqlSelectComment)
            if(!comment.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }
            const message = req.body.message
            const sqlUpdate = `UPDATE comments SET message = '${message}', updated_at = '${at.now()}' WHERE id = '${comment_id}'`
            const updateComment = await db.query(sqlUpdate)
            let messageAlert = 'Successfully Updated'
            if(!updateComment.affectedRows){
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
                comment_id: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const comment_id = req.body.comment_id
            const sqlDeleteComment =  `SELECT id FROM comments WHERE id = '${comment_id}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const comment = await db.query(sqlDeleteComment)
            if(!comment.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }
            const sqlUpdateDelete = `UPDATE comments SET deleted_at = '${at.now()}' WHERE id = '${comment_id}'`
            const updateDelete = await db.query(sqlUpdateDelete)
            let message = 'Successfully Deleted'
            if(!updateDelete.affectedRows){
                message = 'Fail delete'
            }

            return res.status(200).json({
                result:'Success',
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