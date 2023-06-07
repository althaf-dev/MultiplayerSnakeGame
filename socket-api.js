const { io } = require("./app");
const mulplayer1 = new Set();
const movplayer = new Map();
const redApple = { appleX: 5, appleY: 5 };
class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
var gamevalues;



const socketApi = function () {

    io.on('connection', (socket) => {

        console.log("user connected with: " + socket.id);
        socket.on("init", (data) => {

            data.headY = data.headX = Math.floor(Math.random() * 20);
            data.color = generateRandomColor();
            movplayer.set(data.name, data);
            gamevalues = Object.fromEntries(movplayer)
            io.emit("init", gamevalues);
            gameEngine(socket);
            function gameEngine(socket) {

                changeSnakePosition();
                checkCollision(socket);
                wallHit();
                snakeHit();
                io.emit("move", gamevalues);
                setTimeout(gameEngine, 300);
            }

        });
        socket.on("move", (data) => {

            movplayer.set(data.name, data);
            gamevalues = Object.fromEntries(movplayer);

        });
    });
}




function generateRandomColor() {

    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`

}

function changeSnakePosition() {

    let users = Object.keys(gamevalues);
    users.forEach((values) => {
        if (gamevalues[values].pause == 0) {

            gamevalues[values].headX = gamevalues[values].headX + gamevalues[values].xvel;
            gamevalues[values].headY = gamevalues[values].headY + gamevalues[values].yvel;

            gamevalues[values].snakeParts.push(new snakePart(gamevalues[values].headX, gamevalues[values].headY));
            if (gamevalues[values].snakeParts.length > gamevalues[values].tail) {
                gamevalues[values].snakeParts.shift();
            }
        }
    })
}



function checkCollision(socket) {

    let users = Object.keys(gamevalues);
    users.forEach((values) => {

        if (redApple.appleX == gamevalues[values].headX && redApple.appleY == gamevalues[values].headY) {

            redApple.appleX = Math.floor(Math.random() * 20);
            redApple.appleY = Math.floor(Math.random() * 20);
            gamevalues[values].tail++;
            gamevalues[values].score++;
            io.emit("eat", redApple);

        }
    })
}



function wallHit() {

    let users = Object.keys(gamevalues);
    users.forEach((values) => {

        if (gamevalues[values].headX < -2 || gamevalues[values].headX > 20 || gamevalues[values].headY < -1 || gamevalues[values].headY > 20) {
            gameov = 1;
            gamevalues[values].pause = 1;
            gamevalues[values].gameover = 1;
            gamevalues[values].score = 0;
            //movplayer.delete(values);
            //delete gamevalues[values];
           // console.log("gameov-" + values);
            // console.log(gamevalues);
        }
    })

}

function snakeHit() {

    let users = Object.keys(gamevalues);
    users.forEach((values) => {

        for (let i = 0; i < gamevalues[values].snakeParts.length - 2; i++) {
            let part1 = gamevalues[values].snakeParts[i];
            if (part1.x === gamevalues[values].snakeParts[gamevalues[values].snakeParts.length - 1].x && part1.y === gamevalues[values].snakeParts[gamevalues[values].snakeParts.length - 1].y) {

                gameov = 1;
                //console.log("broken");
                gamevalues[values].pause = 1;
                gamevalues[values].gameover = 1;
                gamevalues[values].score = 0;
                //movplayer.delete(values);
                //delete gamevalues[values];
              //  console.log("gameov-" + values);
                break;

            }
        }

    })
}
module.exports = socketApi;