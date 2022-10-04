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
        try {
            if (data.run_is_pic1 === '1') { data.pic1_ret = await picUpload(data.pic1_path);}
            else { data.pic1_ret = [{imgUrl: ''}] }
            if (data.run_is_pic2 === '1') { data.pic2_ret = await picUpload(data.pic2_path);}
            else { data.pic2_ret = [{imgUrl: ''}] }
        } catch (error) {
            console.log(error);
            return res.send(false)
        }
        conn.query(`INSERT INTO cards (len, date, time, comment, isPic1, isPic2, pic1Url, pic2Url, username) VALUES ('${data.run_len}', '${data.run_date}', '${data.run_time}', '${data.run_comment}', ${data.run_is_pic1}, ${data.run_is_pic2}, '${data.pic1_ret[0].imgUrl}', '${data.pic2_ret[0].imgUrl}', '${req.session.user.username}')`, (err) => {
            if (err) {
                console.log(err);
                return res.send(false)
            } else {
                conn.query(`SELECT clockNum, integration FROM users where username='${req.session.user.username}'`, (err, ret) => {
                    // console.log(ret);
                    if (err) {console.log(err); return res.send(false)}
                    conn.query(`UPDATE users SET integration=${ret[0].integration + 5 + (parseFloat((data.run_len).split(' ')[0]) + parseFloat((data.run_len).split(' ')[1] / 100)) * 2 + data.run_is_pic1 * 3 + data.run_is_pic2 * 3}
                    , clockNum=${ret[0].clockNum + 1} where username='${req.session.user.username}'`, (err) => {
                        if (err) {console.log(err); return res.send(false)}
                    })
                })
            }
        })
        res.send(true)
    })
module.exports = router