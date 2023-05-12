const musicContainer = document.querySelector('.music-container'),
    prevBtn = document.querySelector('#prev'),
    playBtn = document.querySelector('#play'),
    nextBtn = document.querySelector('#next')

const audio = document.querySelector('#audio'),
    progress = document.querySelector('.progress'),
    progressContainer = document.querySelector('.progress-container')

const title = document.querySelector('.title'),
    artist = document.querySelector('.artist'),
    album = document.querySelector('.album'),
    cover = document.querySelector('#cover')

const currTime = document.querySelector('#currTime'),
    durTime = document.querySelector('#duration')

const volumeSlider = document.querySelector('#volume-slider'),
    audioMute = document.querySelector('#mute')

// song titles
const songs = [
    'Winter\'s Call',
    'Diamond', 
    'Cry Me A River', 
    'Resend',
    'The Harvest', 
    'Ephemeris', 
    'Bop Skip Doodle',
    'After Midnight',
    'Fudge',
    'Phakade Lami',
    'Do You Remember'
]

// keep track of the songs
let songIndex = 4

// load the songs into the DOM 
loadSong(songs[songIndex])

// update the song details
function loadSong(song){

    audio.src = `music/${song}.mp3`

    // get song tags, and populate the DOM
    jsmediatags.read(audio.src, {
        onSuccess: (tag) => {

            // get album art info
            const data = tag.tags.picture.data
            const format = tag.tags.picture.format
            let base64String = ""

            for(let i = 0; i < data.length; i++)
                base64String += String.fromCharCode(data[i])
            
            // append to the DOM on song change
            album.innerHTML = `${tag.tags.album} (${tag.tags.year})`
            title.innerText = tag.tags.title
            artist.innerText = tag.tags.artist
            cover.src = `data:${format};base64,${window.btoa(base64String)}`

        },
        onError: (error) => {
            console.log(error)
        }
    })

    // 'jsmediatags' is a library to manipulate media files found on https://github.com/aadsm/jsmediatags
}

// play a song
function playSong(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')

    audio.play()
}

// pause the song
function pauseSong(){
    musicContainer.classList.remove('play')
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')

    audio.pause()
}

// play previous song
function prevSong(){
    songIndex--

    if(songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong(songs[songIndex])

    playSong()
}

// play next song
function nextSong(){
    songIndex++

    if(songIndex > songs.length - 1){
        songIndex = 0
    }

    loadSong(songs[songIndex])

    playSong()
}

// update the progress bar
function updateProgress(e){
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

// set the progress bar
function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}

// get the duration and current time of the song now playing
function songDuration(e){
    const {duration, currentTime} = e.srcElement
    var seconds
    var mili_seconds

    // define minutes in current time
    let minutes = (currentTime == null) ? 0 : Math.floor(currentTime / 60)
    minutes = minutes < 10 ? '0' + minutes : minutes

    // define seconds in current time
    function getSeconds(x){
        if(Math.floor(x) >= 60){
            for(var i = 0; i <= 60; i++){
                if(Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))){
                    seconds = Math.floor(x) - (60 * i)
                    seconds = seconds < 10 ? '0' + seconds : seconds
                }
            }
        }
        else{
            seconds = Math.floor(x)
            seconds = seconds < 10 ? '0' + seconds : seconds
        }
    }

    getSeconds(currentTime, seconds)

    // change curret time in the DOM
    currTime.innerHTML = minutes + ':' + seconds

    // define minutes in duration
    let max_minutes = (isNaN(duration) === true) ? 0 : Math.floor(duration / 60)
    max_minutes = max_minutes < 10 ? '0' + max_minutes : max_minutes

    function getMiliSeconds(x){
        if(Math.floor(x) >= 60){
            for(var i = 0; i <= 60; i++){
                if(Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))){
                    mili_seconds = Math.floor(x) - (60 * i)
                    mili_seconds = mili_seconds < 10 ? '0' + mili_seconds : mili_seconds
                }
            }
        }
        else{
            mili_seconds = (isNaN(duration) === true) ? '0' : Math.floor(x)
            mili_seconds = mili_seconds < 10 ? '0' + mili_seconds : mili_seconds
        }
    }

    // define seconds time
    getMiliSeconds(duration)

    // change the duration in the DOM
    durTime.innerHTML = max_minutes + ':' + mili_seconds
}

// trigger event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying){
        pauseSong()
    }
    else{
        playSong()
    }
})

// adjust the volume
function adjustVolume(){
    audio.volume = volumeSlider.value;
}

// mute / unmute audio
function muteUnmute(){
    if(audio.muted == true){
        audio.muted = false
        audioMute.classList.add('fa-volume-up')
        audioMute.classList.remove('fa-volume-mute')
    }
    else{
        audio.muted = true
        audioMute.classList.add('fa-volume-mute')
        audioMute.classList.remove('fa-volume-up')
    }
}

// trigger mute / unmute
document.querySelector('.fa-volume-up').addEventListener('click', muteUnmute)

// change a song 
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)

// update the progress bar on click
audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
audio.addEventListener('timeupdate', songDuration)

// increase / decrease the volume on click
volumeSlider.addEventListener('click', adjustVolume)
volumeSlider.addEventListener('mouseup', adjustVolume)

// listen for end of song event
audio.addEventListener('ended', nextSong)
