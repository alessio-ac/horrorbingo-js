import { supabase } from "./supabase-connect.js"
import { playAudio, addMenuDialog, createTile, createOverlay, createDialog } from './functions.js'

async function supaLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) { console.log(error) }
}

// Flip the status of the tile on DB
async function updateTile(tileId) {
    const { data, error } = await supabase.rpc('flip_bool', { 'tile_id': tileId })
    if (error) { console.log(error) }
    console.log(data)
    const tileDiv = document.getElementById("tile-" + tileId)
    const tileStatus = tileDiv.getAttribute('status')
    if (tileStatus == 'true') {
        tileDiv.setAttribute("status", 'false')
    } else if (tileStatus == 'false') {
        tileDiv.setAttribute("status", 'true')
    }

}

// Call postgres function to get new tiles
async function refreshBoard() {
    const { error } = await supabase.rpc('refresh_live_board_tiles')
    if (error) { console.log(error) }
    console.log("refresh!")
}

// Create the manager for the admin page
/* async function createBoardManager() {
    const { data, error } = await supabase
        .from('live_board_large')
        .select('tile, status')
        .order('id')
    if (error) { console.log("There was an error with createBoardManager: " + error) }

    const listDiv = document.getElementById('listDiv')
    const tileList = document.createElement('ul')
    let i = 1

    for (const item of data) {
        const listItem = document.createElement('li')
        const tileButton = document.createElement('button')

        tileButton.textContent = "Attiva " + i

        const itemId = i
        tileButton.addEventListener('click', () => updateTile(itemId))

        listItem.appendChild(tileButton)
        const listText = document.createElement('span')
        listText.innerHTML = Object.values(item)[0]
        listItem.appendChild(listText)
        
        tileList.appendChild(listItem)

        i++
    }

    listDiv.appendChild(tileList)
} */

const board = document.getElementById('mainBoard')

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

    Object.values(data).forEach(item => {
        const tileDiv = createTile(item, i, Object.values(item)[1])
        const dialogObjects = createDialog(item, i)
        const tileId = i
        tileDiv.addEventListener('click', () => {
            updateTile(tileId)
        })

        board.appendChild(tileDiv)
        i++
    })
}

// Login stuff

document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault()

    const status = document.getElementById("login-status")

    const email = e.target.email.value
    const password = e.target.password.value

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        console.log(error)
        status.textContent = "Failed to log in."
    } else console.log(data)
    status.textContent = "Successfully logged in."
})

document.getElementById('logout').addEventListener('click', supaLogout)

// End of login stuff

const newBoardButton = document.getElementById('refresh-board')
newBoardButton.addEventListener('click', refreshBoard)

initializeGame()