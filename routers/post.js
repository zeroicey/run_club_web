const express = require('express');
const path = require('path')
const conn = require('../database')
const { PicGo } = require('picgo')
const picgo = new PicGo()

router = express.Router()

async function picUpload(picPath) {
    return await picgo.upload([picPath]);
}

router
    .get('/post', (req, res) => {
        if (req.session.user ? false : true) { return res.redirect('/login') }
        res.render('post.html')
    })
    .post('/post', async (req, res) => {
        if (req.session.user ? false : true) { return res.send(false) }
        let data = req.body
        // console.log(data);
        let pictures = req.files
        if (data.run_is_pic1 === "1") { 
            data.pic1_path = path.join(__dirname, '../temp', pictures.run_pic1.md5+'.'+(pictures.run_pic1.name).split('.')[1])
            pictures.run_pic1.mv(data.pic1_path, (err) => {
                if (err) {
                    console.log(err);
                    return res.send(false)
                }
            })
        }
        if (data.run_is_pic2 === "1") { 
            data.pic2_path = path.join(__dirname, '../temp', pictures.run_pic2.md5+'.'+(pictures.run_pic2.name).split('.')[1])
            pictures.run_pic2.mv(data.pic2_path, (err) => {
                if (err) {
                    console.log(err);
                    return res.send(false)
                }
            })
        }
        console.log(data);
        var pic1_ret = [{imgUrl: ''}]
        var pic2_ret = [{imgUrl: ''}]
        try {
            if (data.run_is_pic1 === '1') { pic1_ret = await picUpload(data.pic1_path);}
            if (data.run_is_pic2 === '1') { pic2_ret = await picUpload(data.pic2_path);}
        } catch (error) {
            console.log(error);
            return res.send(false)
        }
        conn.query(`INSERT INTO cards (len, date, time, comment, isPic1, isPic2, pic1Url, pic2Url, username) VALUES ('${data.run_len}', '${data.run_date}', '${data.run_time}', '${data.run_comment}', ${data.run_is_pic1}, ${data.run_is_pic2}, '${pic1_ret[0].imgUrl}', '${pic2_ret[0].imgUrl}', '${req.session.user.username}')`, (err) => {
            if (err) {
                console.log(err);
                return res.send(false)
            } else {
                conn.query(`SELECT clockNum FROM users where username='${req.session.user.username}'`, (err, ret) => {
                    // console.log(ret);
                    if (err) {console.log(err); return res.send(false)}
                    conn.query(`UPDATE users SET clockNum=${ret[0].clockNum + 1} where username='${req.session.user.username}'`, (err) => {
                        if (err) {console.log(err); return res.send(false)}
                    })
                })
            }
        })
        res.send(true)
    })
module.exports = router