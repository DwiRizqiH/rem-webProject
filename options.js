exports.serverPort = 8000

exports.corsOptions = { origin: ['http://localhost:8880', 'http://localhost:8000'] }

exports.sessionSettings = { secret: 'hehe:v', saveUninitialized: false, resave: true }

exports.baseBotAPI = 'http://localhost:5723'


// !! Dont change this if you don't know what you do !!
exports.visibleStaticRouter = '/'
exports.staticFile = '/src'
exports.viewEngine = 'ejs'
exports.fileViewEngine = './src'