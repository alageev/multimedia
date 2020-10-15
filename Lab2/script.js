const resolution = 3

const canvas = document.getElementById(`canvas`)
const context = canvas.getContext(`2d`)

//создание и загрузка изображений
const sourceImage = new Image()
const grayscaleImage = new Image()
sourceImage.src = `Images/source@${resolution}x.jpg`
grayscaleImage.src = `Images/grayscale@${resolution}x.jpg`

const imageSize = sourceImage.width
const rectWidth = imageSize / 256

canvas.width = imageSize
canvas.height = imageSize * 5 + 50

//отрисовка исходных изображений
context.drawImage(sourceImage, 0, 0, imageSize, imageSize)
context.drawImage(grayscaleImage, 0, imageSize + 10, imageSize, imageSize)

//переводим изоюбражение в данные изображения
const myImageData = context.getImageData(0, 0, imageSize, imageSize)
const grayscaleImageData = context.getImageData(0, imageSize + 10, imageSize, imageSize)
let myData = myImageData.data
let grayscaleData = grayscaleImageData.data

//переводим изображения в чб и находим максимальную и минимальную разницы для нормировки
let minDifference = 255
let maxDifference = 0

for (let i = 0; i < myData.length; i += 4){
    const gray = grayscale(myData, i)
    for (let j = i; j < i + 3; j++){
        myData[j] = gray
        grayscaleData[j] = Math.sqrt(Math.pow(grayscaleData[j], 2) - Math.pow(gray, 2))
    }
    if (grayscaleData[i] < minDifference){
        minDifference = grayscaleData[i]
    }
    if (grayscaleData[i] > maxDifference){
        maxDifference = grayscaleData[i]
    }
}

//нормировка
maxDifference -= minDifference
for (let i = 0; i < grayscaleData.length; i += 4){
    const newGray = (grayscaleData[i] - minDifference) * 255 / maxDifference
    if (newGray < 128){
        grayscaleData[i]     = 0
        grayscaleData[i + 1] = newGray * 2
        grayscaleData[i + 2] = 255 - newGray * 2
    } else {
        grayscaleData[i]     = newGray
        grayscaleData[i + 1] = 255 - newGray
        grayscaleData[i + 2] = 0
    }
}

//построение гистограммы
let histogramArray = []

for (let i = 0; i < 256; i++){
    histogramArray.push(0)
}

for (let i = 0; i < myData.length; i += 4){
    histogramArray[myData[i]]++
}

let histogramMax = 0

for (let i = 0; i < 256; i++){
    if (histogramArray[i] > histogramMax){
        histogramMax = histogramArray[i]
    }
}

for (let i = 0; i < 256; i++){
    histogramArray[i] *= (imageSize - 3) / histogramMax
}

for (let i = 0; i < 256; i++){
    const color = 255 - i
    context.fillStyle = `rgb(${color},${color},${color})`
    context.fillRect(i * rectWidth, 5 * imageSize + 50 - histogramArray[i] - 6, rectWidth + 1, histogramArray[i])
}
context.fillRect(0, 5 * imageSize + 47, imageSize, 3)

context.putImageData(myImageData, 0, 2 * imageSize + 20, 0, 0, imageSize, imageSize)
context.putImageData(grayscaleImageData, 0, 3 * imageSize + 30, 0, 0, imageSize, imageSize)

function grayscale(data, index){
    return 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2]
}
