//Параметры проекта
const numberOfImages = 5
const numberOfRolls = 3
const spinningTime = 3
const fps = 50
const imageSize = window.innerWidth / numberOfRolls

//Настройка canvas
const canvas = document.getElementById(`canvas`)
const context = canvas.getContext(`2d`)
canvas.width = window.innerWidth
canvas.height = imageSize

//Загрузка мультимедиа
const losingSound = new Audio(`Sounds/lose.mp3`)
const winningSound = new Audio(`Sounds/win.mp3`)
const startSound = new Audio(`Sounds/start.mp3`)
let images = []
for (let i = 0; i < numberOfImages; i++){
    images.push(new Image())
    images[i].src = `Images/${i + 1}.png`
}

//Переменные
let startTime
let isSpinning = false
let velocities = []
let interval = null
let table = []

//Создание объектов изображений
for (let i = 0; i < numberOfRolls; i++){
    velocities.push(0)
    table.push([])
    for (let j = 0; j < numberOfImages; j++){
        table[i].push({
            image: images[j],
            x: i * imageSize,
            y: (j - numberOfImages + 1) * imageSize
        })
    }
}

//Первоначальная прорисовка изображений
for (let i = 0; i < numberOfRolls; i++){
    drawColumn(i)
}

//Отображение видимых изображений
function drawColumn(index){
    for (let j = 0; j < numberOfImages; j++){
        const img = table[index][j]
        if (img.y + imageSize >= 0) {
            context.drawImage(img.image, img.x, img.y, imageSize, imageSize)
        }
    }
}

//Передвижение изображений в canvas
function moveColumn(index, velocity){
    for (let image of table[index]){
        if (image.y >= imageSize){
            image.y -= numberOfImages * imageSize
        }
        image.y += velocity
    }
}

//Отрисовка canvas
function drawTable(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < numberOfRolls; i++){
        moveColumn(i, velocities[i])
        drawColumn(i)
    }
    checkEnding()
}

//Запуск анимации
function startSpinning(){
    if (isSpinning){
        return
    }
    startSound.play().then(() => {})
    isSpinning = true
    startTime = Date.now()
    let results = []

    for (let i = 0; i < numberOfRolls; i++) {
        results.push(Math.floor(numberOfImages + Math.random() * (3 * numberOfImages + 1)))
    }

    for (let i = 0; i < numberOfRolls; i++){
        velocities[i] = imageSize * results[i] / fps / spinningTime
    }

    interval = setInterval(drawTable,  1000 / fps)
}

//Проверка истечения времени
function checkEnding() {
    if (Date.now() - startTime < 1000 * spinningTime) {
        return
    }
    clearInterval(interval)
    checkResults()
    isSpinning = false
}

//Проверка результатов
function checkResults(){
    let shownImages = []
    let allImagesAreEqual = true
    for (let i = 0; i < numberOfRolls; i++){
        for (let j = 0; j < numberOfImages; j++){
            if (Math.round(table[i][j].y) === 0){
                shownImages.push(table[i][j].image)
                break
            }
        }
    }
    const firstImage = shownImages[0]
    for (let i = 1; i < numberOfRolls; i++){
        if (shownImages[i] !== firstImage){
            allImagesAreEqual = false
            break
        }
    }
    if (allImagesAreEqual){
        winningSound.play().then(() => {})
    } else {
        losingSound.play().then(() => {})
    }
}