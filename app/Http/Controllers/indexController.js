const db = require("../../Database/connection");
const at = require("../../Helper/index");
const upload = require("../../Services/upload")
const env = require("../../Config/env")

module.exports = {
    user: async (req, res) => {
      
      try {
        console.log(req.body)
        const upload2 =await upload.upload(req, 'image')
          console.log(upload2)
        return res.status(200).json({
          result:'Success',
        })
        } 
        catch (err) {
          console.log(err)
          return res.status(400).json(err.message)
      }
    },

    show: async(req, res) => {
      try{
          console.log(req.params.slug)
          const slug = req.params.slug
          if(slug == null || slug === ''){
              return res.status(404).json({
                  result:'Page not found',
              })
          }
          console.log(slug)
          
          const sqlSelectPost =  `SELECT * FROM posts WHERE slug = '${slug}'` // ` --> use for linking string with variable 
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
  },

  shows: async(req, res) => {
    try{
        const SELECT = 'SELECT posts.*, categories.id, categories.category , posts.id as postId, users.username FROM posts'
        const JOIN = 'INNER JOIN categories ON posts.category_id = categories.id JOIN users ON users.id = posts.user_id'
        const WHERE = `WHERE posts.deleted_at IS NULL AND active=1`
        const sqlSelectPost = `${SELECT} ${JOIN} ${WHERE} ORDER BY posts.created_at DESC`

        const sqlTag = 'SELECT * FROM post_tag INNER JOIN tags ON post_tag.tag_id = tags.id'
        const sqlPopularTag = `SELECT *, (SELECT COUNT(*) FROM post_tag WHERE post_tag.tag_id = tags.id GROUP BY post_tag.tag_id) as used FROM tags WHERE id IN ((SELECT tag_id FROM post_tag)) ORDER BY used DESC`
        
        const sqlPopularPoasts =  `SELECT users.username, posts.* FROM posts INNER JOIN users ON users.id = posts.user_id WHERE posts.active=1 AND posts.deleted_at IS NULL ORDER BY posts.reader DESC LIMIT 3`
        const sqlCategories = `SELECT *, (SELECT COUNT(*) FROM posts WHERE posts.category_id = categories.id) as used FROM categories ORDER BY used DESC`

        const tags = await db.query(sqlTag)
        const posts = await db.query(sqlSelectPost)
        const popularTags = await db.query(sqlPopularTag)
        const popularPosts = await db.query(sqlPopularPoasts)
        const categories = await db.query(sqlCategories)
        console.log(categories)
        //SELECT * FROM posts WHERE posts.user_id = '${user[0].id}' INNER JOIN categories ON posts.category_id = categories.id;
        const data = []
        for(const i in posts){
            const post = posts[i]
            const dataTag = []
            for(const j in tags) {
                const postId = tags[j].post_id
                if(postId === post.postId) {
                    dataTag.push(tags[j])
                }
            } 
            const dataPost = {
                id: post.postId,
                slug: post.slug,
                username: post.username,
                title: post.title,
                subTitle: post.sub_title,
                material: post.material,
                category: post.category,
                cover: post.cover?`${env.PATH_POST}/${post.cover}`:'',
                created_at: post.created_at,
                updated_at: post.updated_at,
                tags : dataTag,
            }
            data.push(dataPost)
        }

        const dataPopularPosts = []
        for(const i in popularPosts){
            const popularPost = popularPosts[i]
            const popular = {
                id: popularPost.id,
                username: popularPost.username,
                slug: popularPost.slug,
                title: popularPost.title,
                cover: popularPost.cover?`${env.PATH_POST}/${popularPost.cover}`:'',
                created_at: popularPost.created_at,
            }
            dataPopularPosts.push(popular)
        }


        return res.status(200).json({
            result:'Success',
            data : {
                posts : data ,
                popularTags,
                popularPosts: dataPopularPosts,
                categories
            }
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