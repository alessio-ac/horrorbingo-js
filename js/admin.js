import { supabase } from "./supabase-connect.js"

async function supaLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) { console.log(error) }
}

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
/* document.getElementById('login').addEventListener('click', supaSignIn) */


async function updateTile(tileId) {
    const { data, error } = await supabase.rpc('flip_bool', { 'tile_id': tileId })
    if (error) { console.log(error) }
    console.log(data)
}

async function refreshBoard() {
    const { error } = await supabase.rpc('refresh_live_board_tiles')
    if (error) { console.log(error) }
    console.log("refresh!")
}

/* document.getElementById('updateTile').addEventListener('click', updateTile)
 */
 
async function createBoardManager() {
    const { data, error } = await supabase
        .from('live_board')
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
}

const newBoardButton = document.getElementById('refresh-board')
newBoardButton.addEventListener('click', refreshBoard)

createBoardManager()
