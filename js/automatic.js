import { supabase } from './supabase-connect.js'
import { playAudio, addMenuDialog, createTile, createOverlay, createDialog } from './functions.js'
 
const board = document.getElementById('mainBoard')

// Fetch the board and create each element, should only be called on page load
async function initializeGame() {
    const { data, error } = await supabase
        .from('live_board_large')
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
        const tileDiv = createTile(item, i, Object.values(item)[1])
        tileDiv.appendChild(createOverlay())
        const dialogObjects = createDialog(item, i)
        tileDiv.addEventListener('click', () => {
            dialogObjects[0].showModal()
            playAudio('dialog-audio')
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

// Visually toggle each tile (nothing to do with DB)
async function toggleTile(payload) {
    const payloadId =  Object.values(payload)[4]['id']
    const payloadStatus =  Object.values(payload)[4]['status']
    const tileDiv = document.getElementById("tile-" + payloadId)
    tileDiv.setAttribute("status", payloadStatus)
    if (payloadStatus) { playAudio('tile-audio') }
}

// Realtime subscription to visually toggle the tiles 
const myChannel = supabase.channel('live_board_large')

myChannel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'live_board_large' },
    payload => {
        console.log("Realtime payload received");
        toggleTile(payload)
    } 
)
.subscribe(status => {
    if (status === 'SUBSCRIBED') {
        console.log("Channel subscribed");
    } else if (status === "ERROR") {
        console.error("subsription error")
    }
});

initializeGame()
addMenuDialog('info-dialog', '.info-button')
/* document.getElementById('info-dialog').showModal() */