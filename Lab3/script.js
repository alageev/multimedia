function setup() {
    createCanvas(400, 400, WEBGL)
    sliders = {
        numberOfCubes: createSlider(0, 27, 27, 1),
        cubeSize: createSlider(0, 50, 50, 1),
        distance: createSlider(0, 50, 10, 1)
    }
}

let colorPointer = 0
let rotation = {x: 0, y: 0}

const colors = [
    `#0a84ff`, //blue
    `#30d158`, //green
    `#5e5ce6`, //indigo
    `#ff9f0a`, //orange
    `#ff375f`, //pink
    `#bf5af2`, //purple
    `#ff453a`, //red
    `#64d2ff`, //teal
    `#ffd60a`  //yellow
]

function draw() {
    const spacing = sliders.cubeSize.value() + sliders.distance.value()
    background(250)
    if (mouseIsPressed) {
        rotation.x = mouseX / 200
        rotation.y = mouseY / 200
    }
    rotateX(rotation.x)
    rotateY(rotation.y)
    strokeWeight(0.5)
    translate(-spacing, -spacing, -spacing)
    for (let i = 0; i < 3; i++){ //z
        for (let j = 0; j < 3; j++){ // y
            for (let k = 0; k < 3; k++){ // x
                fill(colors[colorPointer])
                increaseColorPointer()
                if (26 - (9 * i + 3 * j + k)  < sliders.numberOfCubes.value()){
                    box(sliders.cubeSize.value())
                }
                translate(spacing, 0, 0)
            }
            translate(-3 * spacing, spacing, 0)
        }
        translate(0, -3 * spacing, spacing)
    }
}

function mouseClicked() {
    increaseColorPointer()
}

function increaseColorPointer(){
    colorPointer = (colorPointer + 1) % colors.length
}