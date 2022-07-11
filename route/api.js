const { default: axios } = require('axios')
const { baseBotAPI } = require('../options')

module.exports = (router, listLoginId, listRegisterId, listSendVerifWa) => {
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


    // Jadibot API
    router.post('/api/v2/set/jadibot', (req, res) => {
        if(req?.session?.isLogin) return res.redirect('/dashboard')
        if(req.body.id == undefined) return res.status(400).send({ err: true, msg: 'missing id parameter' })
        if(req.body.query == undefined) return res.status(400).send({ err: true, msg: 'missing query parameter' })
        if(req.body.act == undefined) return res.status(400).send({ err: true, msg: 'missing act parameter' })

        const getJadibotListId = { data: [{ virtualBotId: '1bi214b21', access: { user: { jid: '614861981', name: 'babi' } } }, { virtualBotId: '21ob4o1b41', access: { user: { jid: '9022155151', name: 'haaa' } } }] }
    
        const getPosJadibotId = getJadibotListId.data.find(all => all.virtualBotId == req.body.id)
        if(getPosJadibotId == undefined) return res.status(401).send({ err: true, msg: '401!' })

        const sendReqToBotAPI = Object.assign(req.body, { validateStatus: () => true })
        const resultFromBotAPI = await axios.post(`${baseBotAPI}/api/jadibot`, sendReqToBotAPI)

        if(resultFromBotAPI.data.err) return res.status(502).send({ err: true, msg: 'err in bot api, maybe still restarting', status: resultFromBotAPI.status })
        return res.send({ err: false })
    })
}