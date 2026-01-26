import { supabase } from './supabase-connect.js'
import { playAudio, createTile, createOverlay, createDialog } from './functions.js'

const board = document.getElementById('mainBoard')

// Fetch the tiles from DB and create elements 
async function initializeGame() {
    const { data, error } = await supabase
        .from('live_board')
        .select('tile, status, description')
        .order('id')

    if (error) {
        console.log("There was an error with the game initialization: " + error)
    }

    console.log("Board fetched successfully")
    let i = 1
    board.innerHTML = ""

    const dialogContainer = document.getElementById('dialog-container')

    Object.values(data).forEach(item => {
        const tileDiv = createTile(item, i, 'false')
        tileDiv.appendChild(createOverlay())
        const dialogObjects = createDialog(item, i)
        const tileId = i
        tileDiv.addEventListener('click', () => {
            toggleTile(tileId)
        })
        board.appendChild(tileDiv)

 /*        const tileDiv = document.createElement('div')
        tileDiv.setAttribute('id', "tile-" + i)
        tileDiv.classList.add('tile')
        tileDiv.textContent = Object.values(item)[0]
        tileDiv.setAttribute("status", 'false')

        const fuseOverlay = document.createElement('img')
        fuseOverlay.classList.add('fuse-overlay')
        fuseOverlay.setAttribute('src', 'fuse-1.svg')

        const descripitonDialog = document.createElement('dialog')

        descripitonDialog.setAttribute('id', 'dialog-' + i)
        descripitonDialog.innerHTML = Object.values(item)[2] + '<br>'
        dialogContainer.appendChild(descripitonDialog)

        const dialogCloseButton = document.createElement('button')
        dialogCloseButton.classList.add('dialog-close')
        dialogCloseButton.innerHTML = 'Chiudi'

        const dialogOpenButton = document.createElement('button')
        dialogOpenButton.classList.add('dialog-open')
        dialogOpenButton.innerHTML = 'i'

        dialogOpenButton.addEventListener('click', () => {
            descripitonDialog.showModal()
        })

        dialogCloseButton.addEventListener('click', () => {
            descripitonDialog.close()
        })

        descripitonDialog.appendChild(dialogCloseButton)

        const tileId = i

        tileDiv.addEventListener('click', () => {
            toggleTile(tileId)
            console.log(tileId)
        })

        tileDiv.appendChild(fuseOverlay)
        board.appendChild(tileDiv)

        console.log(Object.values(item)) */
        i++
    })
}

async function toggleTile(tileId) {
    const tileDiv = document.getElementById("tile-" + tileId)
    const tileStatus = tileDiv.getAttribute('status')
    if (tileStatus == 'true') {
        tileDiv.setAttribute("status", 'false')
    } else if (tileStatus == 'false') {
        tileDiv.setAttribute("status", 'true')
        playAudio()
    }
}

const mainBoard = document.getElementById('mainBoard');
const divs = mainBoard.querySelectorAll('div')

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

initializeGame()
/* resizeText()
 */