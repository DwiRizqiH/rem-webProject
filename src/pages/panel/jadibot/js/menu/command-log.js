setTimeout(() => {
    socket.emit("emitEvent", {
        id: dataGet?.vId,
        act: 'register',
        return: 'logCmd'
    });
    
    socket.on(`logCmd-${dataGet?.vId}`, (args) => {
        if (args.result) $('#logBody').prepend(`<span>${args.data}</span>`)
        $("#logBody").scrollTop();
    });
}, 5000);