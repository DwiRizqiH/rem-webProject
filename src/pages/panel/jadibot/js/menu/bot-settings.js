function submitChecked(cb) {
    $(`div#${cb.id}`).addClass('spinner-border spinner-border-sm')

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if(xhr.status == 200) {
                addSuccessIconOnChecked(cb)
            } else {
                addErrorIconOnChecked(cb)
            }
        }
    }

    xhr.onerror = function (err) {
        console.log('nyeh', err)
        addErrorIconOnChecked(cb)
    };
    
    xhr.open('GET', `/pages`);
    xhr.send();
}


function addErrorIconOnChecked (cb) {
    $(`div#${cb.id}`).removeClass('spinner-border spinner-border-sm').addClass('text-danger').text(`Error!`)

    setTimeout(() => {
        $(`div#${cb.id}`).removeClass('ni ni-x-octagon text-danger').text('')
    }, 10000);
}

function addSuccessIconOnChecked(cb) {
    $(`div#${cb.id}`).removeClass('spinner-border spinner-border-sm').addClass('ni ni-check-bold text-success')

    setTimeout(() => {
        $(`div#${cb.id}`).removeClass('ni ni-check-bold text-success')
    }, 10000);
}