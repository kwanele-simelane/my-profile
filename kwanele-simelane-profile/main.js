const draggable_list = document.getElementById('draggable-list')
const check_oder = document.getElementById('check')

const top_ten_songs = [
    'Lis Sarroca - Pacquime',
    'DJ Aakmael - Joust (Forteba Alternative Mix)',
    'Folamour - Those Are Just Places To Me Now',
    'Fred Monk - Fortune',
    'Hosini - Capella',
    'Lyrik Shoxen - Stay With Me (Da Afrika Deep Remix)',
    'Black Coffee, Alexander James - Masquerade',
    'Nocktik - Strange New Things',    
    'DJ Hypnosis, Nickson - Something Like This',    
    'Atjazz - V1rus (Jamlud Kudegra Remix)'
]

// store the list items
const list_items = []

let drag_start_index

create_list()

// append list items into DOM
function create_list(){
    [...top_ten_songs]
        .map(a => ({value: a, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((song, index) => {
            const list_item = document.createElement('li')

            list_item.setAttribute('data-index', index)

            list_item.innerHTML = `
                <span class="number">${index + 1}</span>
                <div class="draggable" draggable="true">
                    <p class="song-name">${song}</p>
                    <i class="fas fa-grip-lines"></i>
                </div>
            `

            list_items.push(list_item)
            draggable_list.appendChild(list_item)
        })

    add_event_listeners()
}

function drag_start(){
    drag_start_index = +this.closest('li').getAttribute('data-index')
}

function drag_enter(){
    this.classList.add('over')
}

function drag_leave(){
    this.classList.remove('over')
}

function drag_over(e){
    e.preventDefault()
}

function drag_drop(){
    const drag_end_index = +this.getAttribute('data-index')
    swap_items(drag_start_index, drag_end_index)

    this.classList.remove('over')
}

function swap_items(from_index, to_index){
    const item_one = list_items[from_index].querySelector('.draggable')
    const item_two = list_items[to_index].querySelector('.draggable')

    list_items[from_index].appendChild(item_two)
    list_items[to_index].appendChild(item_one)
}

function check_order(){
    list_items.forEach((list_item, index) => {
        const song_name = list_item.querySelector('.draggable').innerText.trim()

        if(song_name !== top_ten_songs[index]){
            list_item.classList.add('wrong')
        }
        else{
            list_item.classList.remove('wrong')
            list_item.classList.add('right')
        }
    })
}

function add_event_listeners(){
    const draggables = document.querySelectorAll('.draggable')
    const drag_list_item = document.querySelectorAll('.draggable-list li')

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', drag_start)
    })

    drag_list_item.forEach(item => {
        item.addEventListener('dragover', drag_over)
        item.addEventListener('drop', drag_drop)
        item.addEventListener('dragenter', drag_enter)
        item.addEventListener('dragleave', drag_leave)
    })
}

check_oder.addEventListener('click', check_order)

