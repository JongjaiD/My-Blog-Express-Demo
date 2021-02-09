const db = require("../Database/connection");

async function  tag(post_id ,tags){
    
    const keep = [];
    for(const i in tags){
        const values = {
            tag: tags[i]
        }

        const sqlCheckTag =  `SELECT id FROM tags WHERE tag = '${tags[i]}'` // ` --> use for linking string with variable
        const tagChecked = await db.query(sqlCheckTag)
        console.log(tagChecked)
        
        let tagId = tagChecked.length? tagChecked[0].id:''
        
        console.log(tagId)
        console.log(tagChecked)
        if(!tagChecked.length){
            const sqlInsertTag = "INSERT INTO tags SET?"
            const tag = await db.query(sqlInsertTag, values)   
            keep.push(tag.insertId)
            tagId = tag.insertId
        } 
        const values2 = {
            tag_id: tagId,
            post_id: post_id
        }
        const sqlInsertPostTag = "INSERT INTO post_tag SET?"
        const postTag = await db.query(sqlInsertPostTag, values2) 
    }
}
module.exports = tag
    
