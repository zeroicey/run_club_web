const express = require('express')
const conn = require('../database')

router = express.Router()

router
  .get('/login', (req, res) => {
    res.render('login.html')
  })
  .post('/login', (req, res) => {
    login_data = req.body
    conn.query(`SELECT password, nickname FROM users where username="${login_data.username}"`, (err, ret) => {
      if (err) {
        console.log('Database error');
        res.send(false)
      }
      // console.log(ret);
      else {
        try {
          if (ret[0].password === login_data.password) {
            req.session.user = login_data
            conn.query(`UPDATE users SET lastLoginTime='${new Date().getTime()}' WHERE username='${login_data.username}'`, (err, ret) => {
              if (err) { console.log(err); return res.send(false) }                    
              return res.send(true)
            })
          } else {
            res.send(false)
          }
        } catch (error) {
          console.log(error);
          return res.send(false)
        }
      }
    })
  })

module.exports = router
