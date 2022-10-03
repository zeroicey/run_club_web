const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const upload = require('express-fileupload')

const app = express()
const port = 80
const port_test = 3000

// routers
const indexRouter = require('./routers/index')
const loginRouter = require('./routers/login')
const postRouter = require('./routers/post')
const userRouter = require('./routers/user')

app.engine('html', require('express-art-template'));

// upload picture
app.use(upload())

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/static/', express.static(path.join(__dirname, './static')));
app.use('/node_modules/', express.static(path.join(__dirname ,'./node_modules')));

app.use(indexRouter)
app.use(loginRouter)
app.use(postRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log(`Running on ${port}`);
})