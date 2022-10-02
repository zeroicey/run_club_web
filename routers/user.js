const express = require('express')
const conn = require('../database')

router = express.Router()

router
    .get('/user', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        conn.query(`SELECT password, nickname, username, class FROM users where username="${req.session.user.username}"`, (err, ret0) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                conn.query(`SELECT * FROM cards where username='${req.session.user.username}' ORDER BY id DESC`, (err, ret1) => {
                    if (err) {
                        console.log(err);
                        res.send(false)
                    } else {
                        ret0[0]._class = ret0[0].class
                        // console.log(ret1);
                        res.render('user.html', {user: ret0[0], cards: ret1})
                    }
                })

            }
        })
    })
    .post('/user', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        let data = req.body
        // console.log(data);
        conn.query(`SELECT password, nickname, class FROM users where username="${req.session.user.username}"`, (err, ret) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                if (data.class !== ret[0].class || data.password !== ret[0].password || data.nickname !== ret[0].nickname) {
                    conn.query(`UPDATE users SET password='${data.password}', class='${data.class}', nickname='${data.nickname}' WHERE username='${req.session.user.username}'`, (err) => {
                        if (err) { console.log(err); return res.send(false) }                    
                        else {
                            if (data.password !== ret[0].password) { req.session.user = null }
                            return res.send(true)
                        }
                    })
                } else {
                    res.send(false)
                }
            }
        })
    })

module.exports = router