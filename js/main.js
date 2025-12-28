import { supabase } from './supabase-connect.js'

const board = document.getElementById('mainBoard')

/* async function updateTile() {
    const { data, error } = await supabase.rpc('flip_bool', {'tile_id': 2})
    if (error) { console.log(error) }
    console.log(data)
} */


async function initializeGame() {
    const { data, error } = await supabase
        .from('bingotest')
        .select('tile, status')
        .order('id')

    if (error) {
        console.log("There was an error with the game initialization: " + error)
    }

    console.log("Board fetched successfully")
    let i = 0
    board.innerHTML = ""
    Object.values(data).forEach(item => {
        const tileDiv = document.createElement('div')
        tileDiv.setAttribute('id', i)
        i++
        tileDiv.classList.add('tile')
        tileDiv.textContent = Object.values(item)[0]
        tileDiv.setAttribute("status", Object.values(item)[1])
        board.appendChild(tileDiv)
    })
}

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

const myChannel = supabase.channel('bingotest')
const broadcastChannel = supabase.channel('test-channel')

myChannel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'bingotest' },
    payload => {
        console.log("Realtime payload is working", payload);
/*         fetchData().then(tiles => displayTiles(tiles)) */
        initializeGame()
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

broadcastChannel.on(
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