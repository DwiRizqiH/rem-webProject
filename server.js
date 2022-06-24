const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios')
// const { sleep, getHitsCount, addDelTime, GenerateSerialNumber } = require('./lib/functions');

const router = express.Router();
const app = express();
let listLoginId = []
let listRegisterId = []
let listSendVerifWa = []
global.db =  []
global.db['/lib/database/user/web.json'] = []

app.set('views', './src');
app.set('view engine', 'ejs');
app.use(session({
    secret: 'hehe:v',
    // create new redis store.
    //store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: true
}));
app.set('trust proxy', true)
app.use(cookieParser());
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static(__dirname + '/src'));

// Page Navigation
/**
 * Check is Login or Not
 */
router.get('/', (req, res) => {
    console.log('Client IP : ' + req.ip)
    if(req.session.login) return res.redirect('/dashboard')
    return res.redirect('/login')
})

router.get('/login', (req, res) => {
    if(req?.session?.isLogin) return res.redirect('/dashboard')
    let loginId = GenerateSerialNumber('000000000000')

    const searchExistLoginId = listLoginId.find(object => object.ip == req.ip)
    if(searchExistLoginId) loginId = searchExistLoginId.id

    if(!searchExistLoginId) listLoginId.push({ id: loginId, ip: req.ip })

    const isWrongPassword = req?.session?.isWrongPassword || false
    const isSuccessRegister = req?.session?.isSuccessRegister || false
    req.session.isWrongPassword = false
    req.session.isSuccessRegister = false
    return res.render('pages/sign-in', { loginId, isWrongPassword, isRegister: false, isRegistered: false, isWrongCode: false, isSuccessRegister, isVerifTimestamp: false, registerId: false, verifId: false, titleTop: `Sign In`, titleTop2: `Enter your email and password to sign in` })
})

router.get('/register', (req, res) => {
    if(req?.session?.isLogin) return res.redirect('/dashboard')
    let registerId = GenerateSerialNumber('000000000000')
    let verifId = GenerateSerialNumber('000000000000')

    const searchExistWaVerif = listSendVerifWa.find(object => object.ip == req.ip)
    const searchExistRegisterId = listRegisterId.find(object => object.ip == req.ip)
    if(searchExistWaVerif) verifId = searchExistWaVerif.id
    if(searchExistRegisterId) registerId = searchExistRegisterId.id

    if(!searchExistWaVerif) listSendVerifWa.push({ id: verifId, ip: req.ip })
    if(!searchExistRegisterId) listRegisterId.push({ id: registerId, ip: req.ip })
    if(req?.session?.verifCode != undefined && Date.now() > req?.session?.verifCode?.timestamp) req.session.verifCode.timestamp = false

    const isWrongCode = req.session.isWrongCode || false
    const isRegistered = req.session.isRegistered || false
    const isVerifTimestamp = req?.session?.verifCode?.timestamp || false
    req.session.isWrongCode = false
    req.session.isRegistered = false
    return res.render('pages/sign-in', { loginId: false, isWrongPassword: false, isRegister: true, isRegistered, isSuccessRegister: false, isWrongCode, isVerifTimestamp, registerId, verifId, titleTop: `Sign Up`, titleTop2: `` })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/login')
})

/**
 * Dashboard
 */
router.get('/dashboard', (req, res) => {
    if(!req?.session?.isLogin) return res.redirect('/login')
    return res.render('pages/dashboard', { user: req.session.userName, imgUser: req.session.imgUser, userMoney: "9999999", userMoneyHaram: "19", userXp: "146986824109649016509165610561095", userLevel: "9918" })
})


// API
router.post('/api/login', (req, res) => {
    if(req?.session?.isLogin) return res.redirect('/dashboard')
    if(req.body.id == undefined) return res.status(400).send({ err: true, msg: 'missing id parameter' })
    if(req.body.user == undefined) return res.status(400).send({ err: true, msg: 'missing user parameter' })
    if(req.body.pwd == undefined) return res.status(400).send({ err: true, msg: 'missing pwd parameter' })

    if(!listLoginId.find(object => object.id == req.body.id)) return res.status(401).send({ err: true, msg: '401!' })

    const userList = global.db['/lib/database/user/web.json']
    const position = userList.findIndex(object => object.user == req.body.user)

    listLoginId.splice(listLoginId.findIndex(object => object.id == req.body.id), 1)
    if(position != -1) {
        if(userList[position].pwd == req.body.pwd) {
            req.session.imgUser = '/assets/img/apple-icon.png'
            req.session.userName = userList[position].userName
            req.session.user = req.body.user
            req.session.pwd = req.body.pwd
            req.session.isLogin = true
            return res.redirect('/dashboard')
        } else {
            req.session.isWrongPassword = true
            return res.redirect('/login')
        }
    } else {
        req.session.isWrongPassword = true
        return res.redirect('/login')
    }
})

router.post('/api/register', (req, res) => {
    if(req?.session?.isLogin) return res.redirect('/dashboard')
    if(req.body.id == undefined) return res.status(400).send({ err: true, msg: 'missing id parameter' })
    if(req.body.idverif == undefined) return res.status(400).send({ err: true, msg: 'missing idverif parameter' })
    if(req.body.username == undefined) return res.status(400).send({ err: true, msg: 'missing username parameter' })
    if(req.body.user == undefined) return res.status(400).send({ err: true, msg: 'missing user parameter' })
    if(req.body.pwd == undefined) return res.status(400).send({ err: true, msg: 'missing pwd parameter' })
    if(req.body.wanumber == undefined) return res.status(400).send({ err: true, msg: 'missing wanumber parameter' })
    if(req.body.wacode == undefined) return res.status(400).send({ err: true, msg: 'missing wacode parameter' })

    if(!listRegisterId.find(object => object.id == req.body.id)) return res.status(401).send({ err: true, msg: '401!' })
    if(req?.session?.verifCode == undefined) return res.status(401).send({ err: true, msg: '401!' })
    if(req.session.verifCode.code != req.body.wacode) req.session.isWrongCode = true
    if(!listSendVerifWa.find(object => object.id == req.body.idverif)) return res.status(401).send({ err: true, msg: '401!' })
    if(!listSendVerifWa.find(object => object.ip == req.ip)) return res.status(403).send({ err: true, msg: '403!' })

    listRegisterId.splice(listRegisterId.findIndex(object => object.id == req.body.id), 1)
    listSendVerifWa.splice(listSendVerifWa.findIndex(object => object.id == req.body.idverif), 1)

    const userList = global.db['/lib/database/user/web.json']
    const position = userList.findIndex(object => object.user == req.body.user)
    if(position == -1) {
        if(req.session.verifCode.code != req.body.wacode) return res.redirect('/register')
        global.db['/lib/database/user/web.json'].push({ user: req.body.user, pwd: req.body.pwd, userName: req.body.username, waNumber: req.body.wanumber })
        req.session.isSuccessRegister = true
        return res.redirect('/login')
    } else {
        req.session.isRegistered = true
        return res.redirect('/register')
    }
})

// Verif API
router.post('/api/verif/wa', (req, res) => {
    if(req?.session?.isLogin) return res.redirect('/dashboard')
    if(req.body.id == undefined) return res.status(400).send({ err: true, msg: 'missing id parameter' })

    console.log(listSendVerifWa)
    console.log(listSendVerifWa.find(object => object.id != req.body.id))
    if(!listSendVerifWa.find(object => object.ip == req.ip)) return res.status(403).send({ err: true, msg: '403!' })
    if(!listSendVerifWa.find(object => object.id == req.body.id)) return res.status(401).send({ err: true, msg: '401!' })
    if(req?.session?.verifCode?.timestamp > Date.now()) return res.status(502).send({ err: true, msg: 'cooldown', t: req.session.verifCode.timestamp })

    req.session.verifCode = {code: 'AIUBIAU', timestamp: Date.now() + 30000}
    return res.send({ err: false })
})


app.use('/', router);
app.set('port', (8000))
app.listen(app.get('port'), () => {
    console.log('App Started on PORT', app.get('port'));
})



// Function
function GenerateRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Generates a random alphanumberic character
function GenerateRandomChar() {
    var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
    var randomNumber = GenerateRandomNumber(0,chars.length - 1);
    return chars[randomNumber];
}
function GenerateSerialNumber(mask){
    var serialNumber = "";
    if(mask != null){
        for(var i=0; i < mask.length; i++){
            var maskChar = mask[i];
            serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
        }
    }
    return serialNumber;
}