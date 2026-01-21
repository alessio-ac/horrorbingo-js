import { supabase } from './supabase-connect.js'

const board = document.getElementById('mainBoard')

async function initializeGame() {
    const { data, error } = await supabase
        .from('live_board')
        .select('tile, status')
        .order('id')

    if (error) {
        console.log("There was an error with the game initialization: " + error)
    }

    console.log("Board fetched successfully")
    let i = 1
    board.innerHTML = ""
    Object.values(data).forEach(item => {
        const tileDiv = document.createElement('div')
        const fuseOverlay = document.createElement('img')
        tileDiv.setAttribute('id', "tile-" + i)
        i++
        tileDiv.classList.add('tile')
        tileDiv.textContent = Object.values(item)[0]
        tileDiv.setAttribute("status", Object.values(item)[1])
        fuseOverlay.classList.add('fuse-overlay')
        fuseOverlay.setAttribute('src', 'fuse-1.svg')
        tileDiv.appendChild(fuseOverlay)
        board.appendChild(tileDiv)
    })
}

async function toggleTile(payload) {
    const payloadId =  Object.values(payload)[4]['id']
    const payloadStatus =  Object.values(payload)[4]['status']
    const tileDiv = document.getElementById("tile-" + payloadId)
    tileDiv.setAttribute("status", payloadStatus)
}

const myChannel = supabase.channel('live_board')
const broadcastChannel = supabase.channel('test-channel')

myChannel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'live_board' },
    payload => {
        console.log("Realtime payload is working", Object.values(payload));
/*         fetchData().then(tiles => displayTiles(tiles)) */
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

function messageReceived(payload) {
    console.log(payload)
}

initializeGame()

/* broadcastChannel.on(
    'broadcast',
    { event: '*' },
    (payload) => messageReceived(payload)
).subscribe(status => {
    if (status === 'SUBSCRIBED') {
        console.log("test subscribed");
    } else if (status === "ERROR") {
        console.error("test error")
    }
})
 */

/* async function fetchData() {
    const { data, error } = await supabase
        .from('bingotest')
        .select('tile, status')
        .order('id')
        if (error) {
            console.log(error)
        } return data
}

function displayTiles(tiles) {
    board.innerHTML = ""

    Object.values(tiles).forEach(item => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add("tile")
        tileDiv.textContent = Object.values(item)[0]
        board.appendChild(tileDiv)
        if (Object.values(item)[1]) {
            tileDiv.style.backgroundColor = "red"
        }
    })
}

fetchData().then(tiles => displayTiles(tiles)) */