const express = require('express')
const conn = require('../database')

router = express.Router()

router
    .get('/user', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        conn.query(`SELECT password, nickname, username, class FROM users where username="${req.session.user.username}"`, (err, ret0) => {
            if (err) {
                console.log('Database error');
                res.send(false)
            } else {
                conn.query(`SELECT * FROM cards where username='${req.session.user.username}' ORDER BY id DESC`, (err, ret1) => {
                    if (err) {
                        console.log(err);
                        console.log('Database error');
                        res.send(false)
                    } else {
                        ret0[0]._class = ret0[0].class
                        console.log(ret1);
                        res.render('user.html', {user: ret0[0], cards: ret1})
                    }
                })

            }
        })
    })

module.exports = router