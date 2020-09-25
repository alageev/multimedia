const resolution = 4

const canvas = document.getElementById(`canvas`)
const context = canvas.getContext(`2d`)
const sourceImage = new Image()
const grayscaleImage = new Image()
sourceImage.src = `Images/source@${resolution}x.jpg`
// sourceImage.src = `Images/newSource@${resolution}x.jpg`
grayscaleImage.src = `Images/grayscale@${resolution}x.jpg`
const imageSize = sourceImage.width
canvas.width = imageSize * 3 + 20
canvas.height = imageSize * 2 + 10
context.drawImage(sourceImage, 0, 0, imageSize, imageSize)
context.drawImage(grayscaleImage, imageSize + 10, 0, imageSize, imageSize)

const myImageData = context.getImageData(0, 0, imageSize, imageSize)
const grayscaleImageData = context.getImageData(imageSize + 10, 0, imageSize, imageSize)
let myData = myImageData.data
let grayscaleData = grayscaleImageData.data

let maxDifference = 0

for (let i = 0; i < myData.length; i += 4){
    const gray = grayscale(myData, i)
    for (let j = i; j < i + 3; j++){
        myData[j] = gray
        grayscaleData[j] = Math.sqrt(Math.pow(grayscaleData[j], 2) - Math.pow(gray, 2))
    }
    if (grayscaleData[i] > maxDifference){
        maxDifference = grayscaleData[i]
    }
}
let differences = []
for (let i = 0; i < 256; i++){
    differences.push(0)
}
for (let i = 0; i < grayscaleData.length; i += 4) {
    differences[grayscaleData[i]]++
}
let diff = 0
for (let i = 0; i < 256; i++){
    diff += differences[i] * i
}
diff /= Math.pow(imageSize, 2)

for (let i = 0; i < grayscaleData.length; i += 4){
    differences[grayscaleData[i]]++

    if (grayscaleData[i] < 128){
        grayscaleData[i] += 128 + diff
        grayscaleData[i + 1] = 255
    } else {
        grayscaleData[i] = 255
        grayscaleData[i + 1] = (256 - grayscaleData[i + 1]) - diff
    }

    // grayscaleData[i] *= 255 / maxDifference
    // grayscaleData[i + 1] = 255 - grayscaleData[i]
    grayscaleData[i + 2] = 0
}

context.putImageData(myImageData, 2 * (imageSize + 10), 0, 0, 0, imageSize, imageSize)
context.putImageData(grayscaleImageData, 0, imageSize + 10, 0, 0, imageSize, imageSize)

function grayscale(data, index){
    return 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]
}