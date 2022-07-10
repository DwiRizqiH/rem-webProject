const { GenerateSerialNumber } = require('../lib/functions')

module.exports = (router, listLoginId, listRegisterId, listSendVerifWa) => {
    // Login
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
    
    /**
    * Dashboard
    */
   router.get('/dashboard', (req, res) => {
       if(!req?.session?.isLogin) return res.redirect('/login')
       return res.render('pages/dashboard', { navbar: { user: 'Dwi Rizqi', imgUser: '/assets/img/apple-icon.png' }, navbarSide: { isActive: 'dashboard' },  rowHead: { userMoney: "9999999", userMoneyHaram: "19", userXp: "146986824109649016509165610561095", userLevel: "9918" } })
   })
   
}