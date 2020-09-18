//Параметры проекта
const numberOfImages = 5
const numberOfRolls = 3
const spinningTime = 3
const fps = 20
const imageSize = window.innerWidth / numberOfRolls

//Настройка canvas
const canvas = document.getElementById(`canvas`)
const context = canvas.getContext(`2d`)
canvas.width = window.innerWidth
canvas.height = imageSize

//Переменные параметры
let startTime
let isSpinning = false

//
let images = []
// let clickSounds = []
const losingSound = new Audio(`Sounds/lose.mp3`)
const winningSound = new Audio(`Sounds/win.mp3`)

let velocities = []

let interval = null

for (let i = 0; i < numberOfImages; i++){
    images.push(new Image())
    images[i].src = `Images/${i + 1}.png`
}

let table = []

for (let i = 0; i < numberOfRolls; i++){
    velocities.push(0)
    table.push([])
    // clickSounds.push(new Audio(`Sounds/click.mp3`))
    for (let j = 0; j < numberOfImages; j++){
        table[i].push({
            image: images[j],
            x: i * imageSize,
            y: (j - numberOfImages + 1) * imageSize
        })
    }
}

for (let i = 0; i < numberOfRolls; i++){
    drawColumn(i)
}

function drawColumn(index){
    for (let j = 0; j < numberOfImages; j++){
        const img = table[index][j]
        context.drawImage(img.image, img.x, img.y, imageSize, imageSize)
    }
}

function moveColumn(index, velocity){
    for (let image of table[index]){
        if (image.y >= imageSize){
            image.y -= numberOfImages * imageSize
            // if (image === table[index][0]) {
            //     clickSounds[index].play().then(() => {})
            // }
        }
        image.y += velocity
    }
}

function drawTable(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < numberOfRolls; i++){
        moveColumn(i, velocities[i])
        drawColumn(i)
    }
    if (Date.now() - startTime >= 1000 * spinningTime){
        clearInterval(interval)
        let shownImages = []
        for (let i = 0; i < numberOfRolls; i++){
            for (let j = 0; j < numberOfImages; j++){
                if (Math.round(table[i][j].y) === 0){
                    shownImages.push(table[i][j].image)
                    break
                }
            }
        }
        let allImagesAreEqual = true
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
        isSpinning = false
    }
}


function startSpinning(){
    if (isSpinning){
        return
    }
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