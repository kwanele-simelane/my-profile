// get the image
const fileInput = document.getElementById('fileinput')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const srcImage = new Image

let imgData = null
let originalPixels = null

// get the filters for editing the image
const red = document.getElementById('red')
const green = document.getElementById('green')
const blue = document.getElementById('blue')
const brightness = document.getElementById('brightness')
const greyscale = document.getElementById('greyscale')
const contrast = document.getElementById('contrast')

// define RGB values
const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2

// access the image and store it temporarily in an array
fileInput.onchange = function(e){
    if(e.target.files && e.target.files.item(0)){
        srcImage.src = URL.createObjectURL(e.target.files[0])
    }
}

// draw the image on the canvas
srcImage.onload = function(){
    canvas.width = srcImage.width
    canvas.height = srcImage.height
    ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height)
    imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height)
    originalPixels = imgData.data.slice()
}

//get pixel index from image
function getIndex(x, y){
    return (x + y * srcImage.width) * 4
}

// building the filter engines
function runPipeline(){

    currentPixels = originalPixels.slice()
    
    //get each input value
    const greyscaleFilter = greyscale.checked
    const brightnessFilter = Number(brightness.value)
    const contrastFilter = Number(contrast.value)
    const redFilter = Number(red.value)
    const greenFilter = Number(green.value)
    const blueFilter = Number(blue.value)

    for(let i = 0; i < srcImage.height; i++){
        for(let j = 0; j <srcImage.width; j++){
            
            // Apply grayscale to pixel (j, i) if checked
            if(greyscaleFilter){
                setGreyscale(j, i)
            }

            // Apply brightness to pixel (j, i) according to selected value
            addBrightness(j, i, brightnessFilter)

            // Apply contrast to pixel (j, i) according to selected value
            addContrast(j, i, contrastFilter)    
            
            // Add red, green and blue to pixel (j, i) according to selected value
            if(!greyscaleFilter){
                addRed(j, i, redFilter)
                addGreen(j, i, greenFilter)
                addBlue(j, i, blueFilter)
            }
        }
    }

    // draw the updated image
    commitChanges()

}

red.onchange = runPipeline
green.onchange = runPipeline
blue.onchange = runPipeline
brightness.onchange = runPipeline
contrast.onchange = runPipeline
greyscale.onchange = runPipeline

// keep filter values with -255 and 255
function clamp(value){
    return Math.max(0, Math.min(Math.floor(value), 255))
}

// adding rgb value to a pixel
function addBlue (x, y, value){
    const index = getIndex(x, y) + B_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
}

function addGreen (x, y, value){
    const index = getIndex(x, y) + G_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
}

function addRed (x, y, value){
    const index = getIndex(x, y) + R_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
}

function addBrightness(x, y, value){
    addRed(x, y, value)
    addGreen(x, y, value)
    addBlue(x, y, value)
}

function addContrast(x, y, value){
    const redIndex = getIndex(x, y) + R_OFFSET
    const greenIndex = getIndex(x, y) + G_OFFSET
    const blueIndex = getIndex(x, y) + B_OFFSET

    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]

    // Goes from 0 to 2, where 0 to 1 is less contrast and 1 to 2 is more contrast
    const alpha = (value + 255) / 255

    const nextRed = alpha * (redValue - 128) + 128
    const nextGreen = alpha * (greenValue - 128) + 128
    const nextBlue = alpha * (blueValue - 128) + 128

    currentPixels[redIndex] = clamp(nextRed)
    currentPixels[greenIndex] = clamp(nextGreen)
    currentPixels[blueIndex] = clamp(nextBlue)
}

function setGreyscale(x, y){
    redIndex = getIndex(x, y) + R_OFFSET
    greenIndex = getIndex(x, y) + G_OFFSET
    blueIndex = getIndex(x, y) + B_OFFSET

    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]

    const mean = (redValue + greenValue + blueValue) / 3

    currentPixels[redIndex] = clamp(mean)
    currentPixels[greenIndex] = clamp(mean)
    currentPixels[blueIndex] = clamp(mean)
}

// draw the image after applying filter
function commitChanges(){
    for(let i = 0; i < imgData.data.length; i++){
        imgData.data[i] = currentPixels[i]
    }

    ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height)
}