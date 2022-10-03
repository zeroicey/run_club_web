const express = require('express')
const conn = require('../database')
const path = require('path')
const { PicGo } = require('picgo')
const picgo = new PicGo()

async function picUpload(picPath) {
    return await picgo.upload([picPath]);
}

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
    .post('/reloadPic', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        let data = req.body
        conn.query(`SELECT isPic1, isPic2, pic1Url, pic2Url FROM cards WHERE id=${data.id}`, async (err, [ret]) => {
            if (err) {
                console.log(err);
                res.send(false)
            } else {
                if (ret.isPic1 === 1) {
                    data.pic1_path = path.join(__dirname, '../temp', ret.pic1Url.split('/')[(ret.pic1Url.split('/')).length-1])
                    try {
                        await picUpload(data.pic1_path)
                    } catch (error) {
                        console.log(error);
                        res.send(false)
                    }
                }
                if (ret.isPic2 === 1) {
                    data.pic2_path = path.join(__dirname, '../temp', ret.pic2Url.split('/')[(ret.pic2Url.split('/')).length-1])
                    try {
                        await picUpload(data.pic2_path)
                    } catch (error) {
                        console.log(error);
                        res.send(false)
                    }
                }
                res.send(true)
            }
        })
    })
    .post('/deleteCard', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        let data_req = req.body
        conn.query(`SELECT clockNum, integration FROM users WHERE username='${req.session.user.username}'`, (err, ret) => {
            if (err) {console.log(err); return res.send(false)}
            conn.query(`SELECT len, isPic1, isPic2 FROM cards WHERE username='${req.session.user.username}'`, (err, [data]) => {
                console.log(data);
                if (err) {console.log(err); return res.send(false)}
                conn.query(`UPDATE users SET integration=${ret[0].integration - 5 - (parseFloat((data.len).split(' ')[0]) + parseFloat((data.len).split(' ')[1] / 100)) * 2 - data.isPic1 * 3 - data.isPic2 * 3}
                    , clockNum=${ret[0].clockNum - 1} where username='${req.session.user.username}'`, (err) => {
                    if (err) {console.log(err); return res.send(false)}
                    else {
                        conn.query(`DELETE FROM cards WHERE id='${data_req.id}'`, (err, ret) => {
                            if (err) {console.log(err); return res.send(false)}
                        })
                    }
                })
            })
        })
        res.send(true)
    })

module.exports = router