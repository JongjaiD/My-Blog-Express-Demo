const Validete = require("../../../Services/validate");
const db = require("../../../Database/connection");
const at = require("../../../Helper/index");
const Tag = require("../../../Services/createTag");
const upload = require("../../../Services/upload")
const env = require("../../../Config/env")

module.exports = {
    create: async(req, res) => {
        try{
            const rules = {
                category_id: 'require|number',
                title: 'require',
                sub_title: 'require',
                material: 'require',
                slug: 'require|unique:posts'
            }
            await Validete(req.body, rules)

            let imgCover = null;
            if(req.files.cover){
                imgCover = await upload.upload(req.files, 'cover', 'posts')
            }

            const user = res.user  //middleware --> authorization
            const sqlPost = "INSERT INTO posts SET?"
            let material = req.body.material
            material = material.replace(/<script>/g,'')
            material = material.replace(/<\/script>/g,'')
            console.log(material)
            const values = {
                user_id: user[0].id,
                slug: req.body.slug,
                category_id: req.body.category_id,
                title: req.body.title,
                sub_title: req.body.sub_title,
                material: material,
                cover: imgCover,
                active: req.body.active?1:0,
                created_at: at.now(),
                updated_at: at.now()
            }
            const data = await db.query(sqlPost, values)
            const sqlSelectPost =  `SELECT * FROM posts WHERE id = '${data.insertId}'` // ` --> use for linking string with variable
            const post = await db.query(sqlSelectPost)

            if(Array.isArray(req.body.tags) && req.body.tags.length){
                await Tag(data.insertId ,req.body.tags)
            }
            


            const sqlSelectCatecory =  `SELECT category FROM categories WHERE id = '${post[0].category_id}'` // ` --> use for linking string with variable
            const category = await db.query(sqlSelectCatecory)

            const postBlog = {
                category: category[0].category,
                title: post[0].title,
                sub_title: post[0].sub_title,
                material: post[0].material,
                cover: post[0].cover?`${env.PATH_POST}/${post[0].cover}`:'',
            }

            return res.status(200).json({
                result:'Success',
                post: postBlog
            })
        }
        catch(error){
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    },

    shows: async(req, res) => {
        try{
            const user = res.user
            const SELECT = 'SELECT * , posts.id as postId FROM posts'
            const JOIN = 'INNER JOIN categories ON posts.category_id = categories.id'
            const WHERE = `WHERE posts.user_id = '${user[0].id}' AND posts.deleted_at IS NULL`
            const sqlTag = 'SELECT * FROM post_tag'
            const sqlSelectPost = `${SELECT} ${JOIN} ${WHERE}`
            const tags = await db.query(sqlTag)
            console.log(tags)
            // const sqlSelectPost =  `SELECT * , posts.id as postId FROM posts INNER JOIN categories ON posts.category_id = categories.id JOIN post_tag WHERE posts.user_id = '${user[0].id}' AND posts.deleted_at IS NULL`
            const posts = await db.query(sqlSelectPost)
            //SELECT * FROM posts WHERE posts.user_id = '${user[0].id}' INNER JOIN categories ON posts.category_id = categories.id;
            const data = []
            for(const i in posts){
                const post = posts[i]
                const dataPost = {
                    id: post.postId,
                    slug: post.slug,
                    title: post.title,
                    subTitle: post.sub_title,
                    material: post.material,
                    category: post.category,
                    cover: post.cover?`${env.PATH_POST}/${post.cover}`:'',
                    create_at: post.created_at,
                    update_at: post.updated_at
                }
                console.log(i)
                console.log(post)
                data.push(dataPost)
            }


            return res.status(200).json({
                result:'Success',
                data
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
                slug: 'require',
                title: 'require',
                sub_title: 'require',
                material: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const slug = req.body.slug  //params, body, header, querystring, fromdata

            const sqlSelectPost =  `SELECT id FROM posts WHERE slug = '${slug}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const post = await db.query(sqlSelectPost)
            if(!post.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }
            const title = req.body.title
            const sub_title = req.body.sub_title
            const material = req.body.material

            const sql = `UPDATE posts SET title = '${title}', sub_title = '${sub_title}', material = '${material}', updated_at = '${at.now()}' WHERE slug = '${slug}'`
            const update = await db.query(sql)
            let message = 'Successfully Updated'
            if(!update.affectedRows){
                message = 'Fail update'
            }
            return res.status(200).json({
                result:'Success',
                message
            })
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    },

    
    delete: async(req, res) => {
        try{
            const rules = {
                slug: 'require'
            }
            await Validete(req.body, rules)
            const user = res.user
            const slug = req.body.slug
            const sqlSelectPost =  `SELECT id FROM posts WHERE slug = '${slug}' AND user_id = '${user[0].id}'` // ` --> use for linking string with variable 
            const post = await db.query(sqlSelectPost)
            if(!post.length){
                return res.status(403).json({
                    result:'forbidden'
                })
            }
            const sql = `UPDATE posts SET deleted_at = '${at.now()}' WHERE slug = '${slug}'`
            const update = await db.query(sql)
            let message = 'Successfully Deleted'
            if(!update.affectedRows){
                message = 'Fail delete'
            }
            return res.status(200).json({
                result:'Success',
                message
            })
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                result:'Fail',
                message: error.message
            })

        }
    },

    show: async(req, res) => {
        try{
            const slug = req.params.slug
            if(slug == null || slug === ''){
                return res.status(404).json({
                    result:'Page not found',
                })
            }
            console.log(slug)
            const user = res.user
            const sqlSelectPost =  `SELECT * FROM posts WHERE slug = '${slug}' AND user_id = '${user[0].id}'`
            

            const post = await db.query(sqlSelectPost)
            if(!post.length){
                return res.status(404).json({
                    result:'Page not found',
                })
            }
           
            const data = {
                id: post[0].postId,
                title: post[0].title,
                subTitle: post[0].sub_title,
                material: post[0].material,
                category: post[0].category,
                cover: post[0].cover?`${env.PATH_POST}/${post[0].cover}`:'',
                create_at: post[0].created_at,
                update_at: post[0].updated_at
            }
            
        
            return res.status(200).json({
                result:'Success',
                data
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