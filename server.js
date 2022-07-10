const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http')
const cors = require('cors')
const axios = require('axios')
const { GenerateSerialNumber } = require('./lib/functions');

const { serverPort, corsOptions, sessionSettings, baseBotAPI, visibleStaticRouter, staticFile, viewEngine, fileViewEngine } = require('./options')

let listLoginId = []
let listRegisterId = []
let listSendVerifWa = []

const router = express.Router();
const app = express();

global.db =  []
global.db['/lib/database/user/web.json'] = []

app.set('views', fileViewEngine);
app.set('view engine', viewEngine);
app.use(session(sessionSettings));
app.set('trust proxy', true)
app.use(cookieParser());
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(visibleStaticRouter, express.static(__dirname + staticFile));
app.use(cors(corsOptions))


router.get('/', (req, res) => {
    console.log('Client IP : ' + req.ip)
    if(req.session.login) return res.redirect('/dashboard')
    return res.redirect('/login')
})

require('./route/page')(router, listLoginId, listRegisterId, listSendVerifWa)

require('./route/panel')(router)

require('./route/api')(router, listLoginId, listRegisterId, listSendVerifWa)

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/login')
})


app.use('/', router);
app.set('port', (serverPort))

const server = http.createServer(app)
server.listen(app.get('port'), () => {
    console.log('App Started on PORT', app.get('port'));
})

// Socket
require('./socket')(server)