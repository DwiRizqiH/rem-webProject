let listSocketIdForConnect = []

module.exports = async (server) => {
    const io = require('socket.io')(server, { origins: '*:*', path: '/jadibot/'});
    io.on("connection", (socket) => {
    
        socket.on("emitEvent", (args) => {
            listSocketIdForConnect[socket.id] = {}
            listSocketIdForConnect[socket.id] = { sId: socket.id, content: args }
        });
    
        socket.on('disconnect', function() {
            console.log('disconnect', socket.id)
    
            delete listSocketIdForConnect[socket.id]
        });
    });
    
    let a = 0
    setInterval(() => {
        for(let i = 0; i < Object.keys(listSocketIdForConnect).length; i++) {
            const readKeySocket = Object.keys(listSocketIdForConnect)[i]
            io.to(listSocketIdForConnect[readKeySocket].sId).emit(`${listSocketIdForConnect[readKeySocket]?.content?.return}-${listSocketIdForConnect[readKeySocket]?.content?.id}`, { id: listSocketIdForConnect[readKeySocket]?.content?.id, result: true, data: `${a} nyehtest` })
        }
        a++
    }, 1000);
}