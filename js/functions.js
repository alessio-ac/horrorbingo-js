export { playAudio, addMenuDialog, createTile, createOverlay, createDialog }

/* function resizeText() {
    childDivs.forEach(div => {
        let fontSize = 100; // Start with a large font size
        div.style.fontSize = fontSize + 'px';

        while (div.scrollHeight > div.clientHeight || div.scrollWidth > div.clientWidth) {
            fontSize--;
            div.style.fontSize = fontSize + 'px';
        }
    });
} */

function playAudio(audioId) {
    const audioPlayer = document.getElementById(audioId)
    audioPlayer.load()
    audioPlayer.play()
}

/* function toggleAudio() {
    const audioPlayers = document.querySelectorAll('audio').forEach((elem) => {
        if (elem.muted == true) { 
            elem.muted = false
        } else if (elem.muted == false) { elem.muted = true }
    })
}

function createMuteButton() {
    const audioButton = document.createElement('button')
    audioButton.classList.add('dialog-close')
    audioButton.addEventListener('click', () => {
        toggleAudio()
    })
    document.getElementById('info-dialog').appendChild(audioButton)
} */

function addMenuDialog(dialogId, buttonId) {
    const dialogElem = document.getElementById(dialogId)
    const linkElem = document.querySelectorAll(buttonId)
    
    const dialogCloseButton = document.createElement('button')
    dialogCloseButton.classList.add('dialog-close')
    dialogCloseButton.innerHTML = "Chiudi"
    dialogCloseButton.addEventListener('click', () => {
        dialogElem.close()
    })

    dialogElem.appendChild(dialogCloseButton)

    linkElem.forEach(element => {
        element.addEventListener('click', () => {
            dialogElem.showModal()
        })
    });
}

function createTile(data, number, status) {
    const tileDiv = document.createElement('div')
    tileDiv.setAttribute('id', "tile-" + number)
    tileDiv.classList.add('tile')
    tileDiv.textContent = Object.values(data)[0]
    tileDiv.setAttribute('status', status)

    return tileDiv
}

function createOverlay() {
    const fuseOverlay = document.createElement('img')
    fuseOverlay.classList.add('fuse-overlay')
    fuseOverlay.setAttribute('src', 'fuse-1.svg')
    return fuseOverlay
}

function createDialog(data, number) {
    const dialogContainer = document.getElementById('dialog-container')
    const descriptionDialog = document.createElement('dialog')
    descriptionDialog.setAttribute('id', 'dialog-' + number)
    descriptionDialog.innerHTML = Object.values(data)[2] + '<br>'
    dialogContainer.appendChild(descriptionDialog)

    const dialogCloseButton = document.createElement('button')
    dialogCloseButton.classList.add('dialog-close')
    dialogCloseButton.innerHTML = "Chiudi"
    dialogCloseButton.addEventListener('click', () => {
        descriptionDialog.close()
    })

    descriptionDialog.appendChild(dialogCloseButton)

    const dialogOpenButton = document.createElement('button')
    dialogOpenButton.classList.add('dialog-open')
    dialogOpenButton.innerHTML = "i"
    dialogOpenButton.addEventListener('click', () => {
        descriptionDialog.showModal()
    })

    return [descriptionDialog, dialogCloseButton, dialogOpenButton]
}