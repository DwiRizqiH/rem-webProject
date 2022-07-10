// When Page is Moved
$('#command-log').click(function(){
    socket.off(`logCmd-${dataGet?.vId}`)
    movePage('command-log')
});

$('#bot-settings').click(function(){
    socket.off(`logCmd-${dataGet?.vId}`)
    movePage('bot-settings')
})

function movePage(target) {
    const xhr = new XMLHttpRequest();
    topbar.show()

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            window.history.pushState(`page-${target}`, target, `/panel/jadibot/${dataGet.vId}/${target}`);
            $('.nav-link.active').removeClass('active')
            $(`#${target}`).addClass('active')

            $('.container-fluid.py-4').html(xhr.responseText)
            
            topbar.progress('+1')
            topbar.hide()
        }
    }
    
    xhr.open('POST', `/panel/jadibot/${dataGet.vId}/${target}`);
    xhr.send();
}