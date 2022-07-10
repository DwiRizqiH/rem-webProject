const axios = require('axios')

module.exports = (router) => {
    // Jadibot
    router.get('/panel/jadibot', async (req, res) => {
        // if(!req?.session?.isLogin) return res.redirect('/login')
        // const getJadibotListId = await axios.post(`${baseBotAPI}/api/v2/get/jadibotlist`)
        const getJadibotListId = { data: [{ virtualBotId: '1bi214b21', access: { user: { jid: '614861981', name: 'babi' } } }, { virtualBotId: '21ob4o1b41', access: { user: { jid: '9022155151', name: 'haaa' } } }] }
        
        return res.render('pages/panel/jadibot/jadibot', { navbar: { user: 'Dwi Rizqi', imgUser: '/assets/img/apple-icon.png' }, navbarSide: { isActive: 'jadibot' }, listJadibotClient: getJadibotListId.data })
    })
    
    router.get('/panel/jadibot/:jadibotId', async (req, res) => {
        // if(!req?.session?.isLogin) return res.redirect('/login')
        // const getJadibotListId = await axios.post(`${baseBotAPI}/api/v2/get/jadibotlist`)
        const getJadibotListId = { data: [{ virtualBotId: '1bi214b21', access: { user: { jid: '614861981', name: 'babi' } } }, { virtualBotId: '21ob4o1b41', access: { user: { jid: '9022155151', name: 'haaa' } } }] }
    
        const getPosJadibotId = getJadibotListId.data.find(all => all.virtualBotId == req.params.jadibotId)
        if(getPosJadibotId == undefined) return res.render('pages/panel/jadibot/menu', { navbar: { user: 'Dwi Rizqi', imgUser: '/assets/img/apple-icon.png' }, navbarSide: { isActive: 'jadibot' }, menu: { isFound: false }, jadibot: {  } })
    
        return res.render('pages/panel/jadibot/menu', { navbar: { user: 'Dwi Rizqi', imgUser: '/assets/img/apple-icon.png' }, navbarSide: { isActive: 'command-log' }, menu: { isFound: true }, jadibot: { vId: req.params.jadibotId } })
    })
    
    router.all('/panel/jadibot/:jadibotId/:pageId', async (req, res) => {
        // if(!req?.session?.isLogin) return res.redirect('/login')
        // const getJadibotListId = await axios.post(`${baseBotAPI}/api/v2/get/jadibotlist`)
    
        if(req.method != 'POST') return res.redirect(`/panel/jadibot/${req.params.jadibotId}`)
        const getJadibotListId = { data: [{ virtualBotId: '1bi214b21', access: { user: { jid: '614861981', name: 'babi' } } }, { virtualBotId: '21ob4o1b41', access: { user: { jid: '9022155151', name: 'haaa' } } }] }
        
        const getPosJadibotId = getJadibotListId.data.find(all => all.virtualBotId == req.params.jadibotId)
        if(getPosJadibotId == undefined) return res.render('pages/panel/jadibot/menu', { navbar: { user: 'Dwi Rizqi', imgUser: '/assets/img/apple-icon.png' }, navbarSide: { isActive: 'jadibot' }, menu: { isFound: false }, jadibot: {  } })
    
        switch(req.params.pageId) {
            case 'command-log':
                return res.render('pages/panel/jadibot/ejs/menu/command-log-body')
                break
            case 'bot-settings':
                return res.render('pages/panel/jadibot/ejs/menu/bot-settings-body', { jadibot: { isOnline: true, isSelf: true } })
                break
            default: {
    
            }
        }
    })
}