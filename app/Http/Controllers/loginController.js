const { response } = require("express");
const db = require("../../Database/connection");
const Validete = require("../../Services/validate");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require("morgan");
const env = require("../../Config/env")

module.exports = {
    login: async(req, res) => {
        try{
            const rules = {
                username: 'require',
                password: 'require|min:8'
            }

            await Validete(req.body, rules)
            const username = req.body.username
            const password = req.body.password
            const regex = /\S+@\S+\.\S+/
            let column = 'email'
            // if(regex.test(username)){
            //     const message = key + ' email invalid'
               
            //     errorValidate.push(message)
            // }

            if(!regex.test(username)){
                column = 'username'
            }
            
            const sqlUser =  `SELECT * FROM users WHERE ${column} = '${username}'` // ` --> use for linking string with variable
            const user = await db.query(sqlUser)
            console.log(sqlUser)
            console.log(user)
            let message = 'username or password is mistake' 
            let displayToUser = 'wrong password'
            if(user.length){             
               const compare = bcrypt.compareSync(password, user[0].password);
               if(compare){
                   message = 'Login success'
                   const accessToken = jwt.sign({ user: user[0].username }, env.JWT_SECRET_KEY);
                //    const decoded = jwt.verify(token, 'dumb');]

                const data = {
                    username: user[0].username,
                    dateBirth: user[0].date_of_birth,
                    email: user[0].email,
                    avatar: user[0].avatar?`${env.PATH_IMAGE}/${user[0].avatar}`:'',
                    accessToken
                }



                return res.status(200).json({
                    result:'Success',
                    message,
                    data
                })
               }
               else{
                   return res.status(401).json({  //200 = success , 400 = bad request, 401 = uncorrect untrolization, 403 = skip account user->admin, 500 = wrong code 
                    result:'untrolization',
                    message
                })
               }
            }
    
            console.log(user.length)
            
        }
        catch(error){
            console.log(error)
            return res.status(200).json({
                result:'Fail',
                message: error.message
            })

        }
    }
}

// const id = { id : 1 , username : 'dai'}
// const id2 = ['usernmae', {id:2 , username: 'dai2'}]

//     id.username


// [
//     {
//         "id": 1,
//         "role_id": 1,
//         "username": "FatLouisTheBestPoog",
//         "first_name": "Louis",
//         "last_name": "Fat",
//         "date_of_birth": "1996-06-11",
//         "email": "louis@gmail.com",
//         "password": "987654",
//         "created_at": null,
//         "updated_at": null,
//         "deleted_at": null
//     }
// ]