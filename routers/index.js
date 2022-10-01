const express = require('express');
const conn = require('../database')

router = express.Router()

router
    .get('/', (req, res) => {
        let isLogin = req.session.user ? true : false;
        res.render('index.html', {
            isLogin: isLogin,
            user: req.session.user
        })
    })
    .get('/getClockData', (req, res) => {
        conn.query("SELECT username, class, clockNum, lastLoginTime FROM users ORDER BY clockNum DESC, term DESC", (err, ret) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                res.send(ret)
            }
        })
    })
    .get('/getSynthesisData', (req, res) => {
        conn.query("SELECT username, class, integration, lastLoginTime FROM users ORDER BY integration DESC, term DESC", (err, ret) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                res.send(ret)
            }
        })
    })
    .get('/getCardData', (req, res) => {
        conn.query("SELECT * FROM cards ORDER BY id DESC", (err, ret) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                res.send(ret)
            }
        })
    })
    .get('/exit', (req, res) => {
        req.session.user = null
        res.send(true)
    })

module.exports = router