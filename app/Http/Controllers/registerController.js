const db = require("../../Database/connection");
const at = require("../../Helper/index");
const bcrypt = require('bcryptjs');
const Validete = require("../../Services/validate");
const { request } = require("express");
const upload = require("../../Services/upload")
const env = require("../../Config/env")
const jwt = require('jsonwebtoken');

module.exports = {
  register: async(req, res) => {
    try {
        const rules = {
          username: 'require|min:5|unique:users',
          date_of_birth: 'require|date',
          email: 'require|email|unique:users',
          password: 'require|min:8',
        }
        await Validete(req.body, rules)
        let imgName = null;
        if(req.files.avatar){
          imgName = await upload.upload(req.files, 'avatar')
        }
              
        const sql = "INSERT INTO users SET?"
        const values = {
          role_id: '2', 
          username: req.body.username,
          date_of_birth: req.body.date_of_birth,
          email: req.body.email,
          avatar: imgName,
          password: bcrypt.hashSync(req.body.password, 10),
          created_at: at.now(),
          updated_at: at.now()
        }
        const data = await db.query(sql, values)
        console.log(data);
        const sqlUser =  `SELECT * FROM users WHERE id = ${data.insertId}` // ` --> use for linking string with variable
        const user = await db.query(sqlUser)
        const accessToken = jwt.sign({ user: user[0].username }, env.JWT_SECRET_KEY);
        const information = {
          username: user[0].username,
          dateBirth: user[0].date_of_birth,
          email: user[0].email,
          avatar: user[0].avatar?`${env.PATH_IMAGE}/${user[0].avatar}`:'',
          accessToken
      }
      

        return res.status(200).json({
          result:'Success',
          message:'',
          data: information
        })
      } 
      catch (err) {
        console.log(err)
        return res.status(400).json(err.message)
    }
  }
}

