
// capture the image input
let input = document.getElementById("image__file");
let imageName = document.getElementById("image__name");

// capture other elements
const canvas = document.querySelector("#tweet__image");
const song__title = document.querySelector("#song__title");
const song__artist = document.querySelector("#song__artist");
const song__duration = document.querySelector("#song__duration");
const playlist = document.querySelector("#playlist");

let image;

// render the image name
input.addEventListener("change", ()=>{
    let inputImage = document.querySelector("input[type=file]").files[0];
    imageName.innerText = inputImage.name;
})

input.addEventListener("change", (e) => {
    const image_data_url = URL.createObjectURL(e.target.files[0]);

    image = new Image();
    image.src = image_data_url;

    image.addEventListener("load", () => {
        update_tweet_canvas(
            canvas, 
            image, 
            song__title.value, 
            song__artist.value, 
            song__duration.value, 
            playlist.value
        );

    }, {
        once: true
    });
});

song__title.addEventListener("keyup", () => {
    update_tweet_canvas(
        canvas,
        image,
        song__title.value,
        song__artist.value,
        song__duration.value,
        playlist.value
    );
});

song__artist.addEventListener("keyup", () => {
    update_tweet_canvas(
        canvas,
        image,
        song__title.value,
        song__artist.value,
        song__duration.value,
        playlist.value
    );
});

song__duration.addEventListener("keyup", () => {
    update_tweet_canvas(
        canvas,
        image,
        song__title.value,
        song__artist.value,
        song__duration.value,
        playlist.value
    );
});

playlist.addEventListener("keyup", () => {
    update_tweet_canvas(
        canvas,
        image,
        song__title.value,
        song__artist.value,
        song__duration.value,
        playlist.value
    );
});

function update_tweet_canvas(canvas, image, song__title, song__artist, song__duration, playlist){
    const context = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    const font_size = Math.floor(width/30);
    const x_offset = width / 12;
    const y_offset = height / 50;
    const center = height / 2;

    // update the canvas background
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0);

    // prepare text
    context.strokeStyle = "black";
    context.lineWidth = Math.floor(font_size / 15);
    context.fillStyle = "#00182e";
    context.lineJoin = "round";
    context.font = `${font_size}px sans-serif`;

    // render the title
    context.textBaseline = "top";
    context.strokeText(song__title, width / 3.3, y_offset + (height / 7.5));
    context.fillText(song__title, width / 3.3, y_offset + (height / 7.5));
    
    // render the artists
    context.textBaseline = "top";
    context.fillText(song__artist, width / 3.3, y_offset + (height / 4));
    
    // render the duration
    context.textBaseline = "top";
    context.font = `${font_size/1.5}px sans-serif`;
    context.strokeText(song__duration, width - (x_offset + 77), y_offset + (center + 30));
    context.fillText(song__duration, width - (x_offset + 77), y_offset + (center + 30));
    
    // render the playlist
    context.textBaseline = "bottom";
    context.font = `${font_size/2}px sans-serif`;
    context.fillText(playlist, x_offset + 160, height - (y_offset + 9));     

}

document.getElementById("download").addEventListener('click', (e) => {
    let canvas_url = canvas.toDataURL("image/png", 0.5);
    const create_element = document.createElement('a');
    create_element.href = canvas_url;
    create_element.download = "Tweet your Now Playing";
    create_element.click();
    create_element.remove();
});

