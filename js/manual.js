import { supabase } from './supabase-connect.js'
import { playAudio, addMenuDialog, createTile, createOverlay, createDialog } from './functions.js'

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
        tileDiv.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            dialogObjects[0].showModal()
            playAudio('dialog-audio')
        })
        board.appendChild(tileDiv)
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
        playAudio('tile-audio')
    }
}

const mainBoard = document.getElementById('mainBoard');
const divs = mainBoard.querySelectorAll('div')

initializeGame()
addMenuDialog('info-dialog', '.info-button')
document.getElementById('info-dialog').showModal()