var login = 0;
const canvas = document.getElementById('game');
const scoreBoard = document.getElementById("s");
const ctx = canvas.getContext('2d');
const foodSound = new Audio('/images/food.mp3');
const gameoverSound = new Audio("/images/gameover.mp3")
const movsound = new Audio("/images/move.mp3");
const bgmsound = new Audio ("/images/music.mp3")
const ctrl = document.querySelector("#menu");
document.body.addEventListener('keydown', keyDown);
const controlMenu = document.getElementById("controlMenu");
const menu = document.getElementById("menu");
const multiplay = document.getElementById("mplayer");
multiplay.addEventListener("click", multiplayer);
const snakeParts = [];
var z = 0;
let mode = "single";
let count = 0;
let tailLength = 2;
let score = 0;
var gameov = 0;
var data1 = {

    name: "h",
    xvel: 0,
    yvel: 0,
    tail: 2,
    play: 0,
    pause: 0,
    gameover: 0,
    color: " ",
    headX:22,
    headY:22,
    snakeParts: [],
    score:0,
    pause:0,
    gameover:0
}
class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}
var data_incoming = {};
let xvelocity = 0;
let yvelocity = 0;
let tileCount = 20;
let tileSize = 15;
let headX1 = 22;
let headY1 = 22;
let appleX1 = 11;
let appleY1 = 6;
let appleX = 5;
let appleY = 5;
let a = 10;
let b = 10;
let coins = 0;
let gold = -1;
var id;
let speed = 200;//The interval will be seven times a second.
const socket = io("http://127.0.0.1:3000");
socket.on("connection");


Snake = {

    color: "black",

    growSnake: function () {

        let users = Object.keys(data_incoming);
        users.forEach((values) => {

            ctx.fillStyle = data_incoming[values].color;
            for (let i = 0; i < data_incoming[values].snakeParts.length; i++) {
                let part = data_incoming[values].snakeParts[i];
                ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            }
        })
    },
    checkCollision: function () {

        if (appleX == headX && appleY == headY) {

            foodSound.play();
            socket.emit("eat", () => console.log("eaten"));
            tailLength++;
            data1.tail = data1.tail + 1;
            score += 1;
            coins += 1;
        }
    }
}



singleSnake = {

    color: "black",

    growSnake: function () {

        ctx.fillStyle = "black";
        for (let i = 0; i < snakeParts.length; i++) {
            part = snakeParts[i];
            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
        }
        snakeParts.push(new snakePart(headX1, headY1));
        if (snakeParts.length > tailLength) {
            snakeParts.shift();
        }
    },
    changeSnakePosition: function () {

        headX1 = headX1 + xvelocity;
        headY1 = headY1 + yvelocity;
    },
    checkCollision: function () {

        if (appleX1 == headX1 && appleY1 == headY1) {

            foodSound.play();
            appleX1 = Math.floor(Math.random() * 10);
            appleY1 = Math.floor(Math.random() * 10);
            tailLength++;
            score += 1;
            coins += 1;
        }
    }
}

food = {

    color: "red",
    drawApple: function () {

        ctx.fillStyle = this.color;// make apple red
        
        ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
        
    }
}

foodforSinglesnake = {

    color: "red",

    drawApple: function () {
        console.log("app",appleX1);
        ctx.beginPath();
        ctx.moveTo(150, 75);
        ctx.lineTo(180, 100);
        ctx.stroke();
        ctx.fillStyle = this.color;// make apple red
        ctx.fillRect(appleX1 * tileCount, appleY1 * tileCount,tileSize, tileSize);
    }
}


Coin = {

    gold: 0,
    coins: 0,
    coinGenerator: function () {
        if (coins % 2 == 0 && score !== 0) {

            ctx.fillStyle = "orange";
            ctx.fillRect(a * tileCount, b * tileCount, tileSize, tileSize);
        }
    },
    coinCollision: function () {
        if (b == headY1 && a == headX1) {

            a = Math.floor(Math.random() * tileCount);
            b = Math.floor(Math.random() * tileCount);
            this.coins += 1;
            this.gold++;
        }
    }
}

Game = {
    Play:"status",
    showControlMenu: function () {
        $('#menu').show();
    },
    pause: function () {

        clearInterval(id);
        console.log("pause");
        if (mode == "multi"){
            data_incoming[$("#pname").html()].pause = 1;
            socket.emit("move",data_incoming[$("#pname").html()])
        }
    },
    play: function () {

        if (mode == "multi"){
            data_incoming[$("#pname").html()].pause = 0;
            socket.emit("move",data_incoming[$("#pname").html()])
        }

         //gameEngine.drawGame();
    },
    restart: function () {

        gameov = 1;
        headX1 = 10;
        headY1 = 10;
        tailLength = 2;
        score = 0;
        snakeParts.length = 0;
      //  drawGame();
        $('#message').hide();
        $('#menu').hide();
      
    },
    wallHit: function () {

        if (headX1 < -2 || headX1 > 20 || headY1 < -1 || headY1 > 20) {
            gameov = 1;
            console.log(gameov);
        }

    },
    snakeHit: function () {

        for (let i = 0; i < snakeParts.length - 2; i++) {
            let part1 = snakeParts[i];
            if (part1.x === snakeParts[snakeParts.length - 1].x && part1.y === snakeParts[snakeParts.length - 1].y) {

                gameov = 1;
                //console.log("broken");

            }
        }
    },
    afterGameOver: function () {
        headX1 = 10;
        headY1 = 10;
        snakeParts.length = 0;
        tailLength = 2;
        $("#message").show();
        $("#ap123").hide();
        $("#hsc").html(score);
        $("#s1234").val(score);
        $("#s1234").hide();
        $("#ap1").html((Coin.gold - 1));
        var profiles = { 'name': $("#pname").html(),'score': score };
        $.post({
            traditional: true,
            url: "/users/dem",
            contentType: 'application/json',
            data: JSON.stringify(profiles),
            dataType: 'json'

        }).done(function (response) {
            let hs1score = response.hscore;
            console.log("score is" + hs1score);
            $("#hsc123").html(response.hscore);

        });
        //score = 0;
        gameoverSound.play();

    },
    Gamestatus: function () {
       
         this.wallHit();
         this.snakeHit();
        if (gameov == 1) {
  
            this.afterGameOver();
            this.showControlMenu();
            this.pause();
            score = 0;
            console.log("over");
            console.log(gameov);
        }
    },
    home: function () {
        mode = "off";
        gameov= 0;
        document.getElementById("menu").style.display = "none";
        $('#menu').hide();
        $("#message").hide();
        $('#playername').hide();
        $("#homebtns").show();
        $("#back").hide();
        canvas.style.border = '20px dashed black';
        ctx.fillStyle = 'green';// make screen black
        make_base();
        
    function make_base()
    {
    base_image = new Image();
    base_image.src = '/images/home.jpg';
    base_image.onload = function(){
    ctx.drawImage(base_image, 0, 0);
   
  }
}



        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);// black color start from 0px left, right to canvas width and canvas height
    }


}


player = {

    name_register: "player2",
    name_login: " ",
    psword_register: " ",
    psword_login: "1111",
    score: 0,
    Hscore: 0,
    coin: 0,
    access: "register",
    playerbtn: function () {

        $('#playername').show();
        $('#homebtns').hide();
    },
    createPlayer: function () {

        this.name_register = $('#playerinput').val();
        this.name_login = $('#login-username').val();
        this.psword_register = $('#password').val();
        this.psword_login = $('#login-password').val();
        this.access = $(this).html();

        $('#pname').html(this.name_login);
        $('#user_gameover').html(this.name_login);
        data1.name = this.name_login;
        console.log(data1.name);
        // data1.name = $("#pname").html();
        if (this.access == "login") {
            var profiles = { name: this.name_login, password: this.psword_login, access: this.access };
        }

        else {
            var profiles = { name: this.name_register, password: this.psword_register, access: this.access };
        }

        $.ajax({
            traditional: true,
            url: "/users",
            type: "POST",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(profiles)
        }).done(function (response) {
            console.log(response);
            login=1;

            $("#msg-usercreated").html(response.result);

        });

    },
    scoreboard12: function () {

        document.getElementById("scorebd1").style.display = "block";
        $("#back").show();
        $('#homebtns').hide();
        profiles_scores = { data: "hello" }
        $.ajax({
            traditional: true,
            url: "/users/score",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(profiles_scores),
            dataType: "json"
        }).done(function (response) {

            response.values.forEach(myfunction);
            function myfunction(item) {
                var table = document.getElementById('score_table');
                var tbody = document.createElement("tbody");
                tbody.id = "score_body";
                table.appendChild(tbody);
                var table_body = document.getElementById('score_body');
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + item.name + '</td>' +
                    '<td>' + item.score + '</td>';
                table_body.appendChild(tr);

            }
        })
    },
    backhome: function () {

        $("#homebtns").show();
        $("#back").hide();
       document.getElementById("scorebd1").style.display = "none";
       document.getElementById("score_body").remove();

    }
}

$('.message a').on('click', function () {
    $('form').animate({
        height: "toggle",
        opacity: "toggle"
    }, "fast");
    $('#ok').animate({
        height: "toggle",
        opacity: "toggle"
    }, "fast");
});

Game.home();
//--------------------------------------------singlemode MAIN FUNCTION------------------------------------------------------------

function gameEngine(){


       if(gameov==0){
        singleSnake.changeSnakePosition();
        clearScreen();
        singleSnake.growSnake();
        foodforSinglesnake.drawApple();
        singleSnake.checkCollision();
        Coin.coinGenerator();
        Coin.coinCollision();
        s.innerHTML = score;
        ap1.innerHTML = score;
        c.innerHTML = Coin.gold;
   
        //console.log("z= "+z);
        z++;
        
        id = setTimeout(gameEngine,speed);

        Game.Gamestatus();
      
       }
      

    }


//------------------------------------------------------------------------------------


//-Screen refresh-black color start from 0px left, right to canvas width and canvas height-----------

function clearScreen() {

    canvas.style.border = '20px dashed black';
    ctx.fillStyle = '#d3f8d3';// make screen black
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    // draw a red line
   
}

//--------------------------------------------------SINGLE-PLAYER-MODE--------------------------------------------------------------

function singlePlayer() {

 
    if(login == 1){
        mode = "single";
        gameov = 0;
        $("#homebtns").hide();
        $('#menu').hide();
        $("#message").hide();
        bgmsound.play();
        gameEngine();
    }
    else{
        player.playerbtn();
    }

   
}

//-------------------------------------------------------------MULTI-PLAYER MODE---------------------------------------------------------------


function multiplayer() {
    mode = "multi";
    socket.emit("init", data1);
    $("#homebtns").hide();
}

socket.on("init", handleInit);
socket.on("move", handleMove);
socket.on("eat", handleEat);

function handleInit(data) {

    data_incoming = Object.assign(data_incoming, data);
    if (Object.keys(data_incoming).includes(($("#pname").html()))) {

       // drawGame();
    }
}

function handleMove(datas) {

    data_incoming = Object.assign(data_incoming, datas);
    if (data_incoming[$("#pname").html()].gameover == 0) {
    clearScreen();
    Snake.growSnake();
    food.drawApple();
    s.innerHTML = data_incoming[$("#pname").html()].score;
    ap1.innerHTML = score;
    console.log("start");
    }
    else{
        if(mode == "multi"){
            //Game.home();
            console.log("end");
            $("#message").show();
            $('#menu').show();
        }
       
    }

}

function handleEat(redApple) {

    console.log(redApple.appleX);
    appleX = redApple.appleX;
    appleY = redApple.appleY;
}

//----------------------------------------------------KeyEvents-------------------------------------------------------------------------

function keyDown(event) {

    if (mode == "single") {
        singleModeKeyEvents(event);
    }
    else {
        multiModeKeyEvents(event);
    }

}

function singleModeKeyEvents(event) {

    if (event.keyCode == 38) {
        yvelocity = -0.5;
        xvelocity = 0;
        movsound.play();
    }
    if (event.keyCode == 40) {
        yvelocity = 0.5;
        xvelocity = 0;
        movsound.play();
    }

    if (event.keyCode == 37) {
        yvelocity = 0;
        xvelocity = -0.5;
        movsound.play();
    }
    if (event.keyCode == 39) {
        yvelocity = 0;
        xvelocity = 0.5;
        movsound.play();

    }
}

function multiModeKeyEvents(event) {

    if (event.keyCode == 38) {

        data_incoming[$("#pname").html()].xvel = 0;
        data_incoming[$("#pname").html()].yvel = -0.5;
        socket.emit("move", data_incoming[$("#pname").html()]);
    }
    if (event.keyCode == 40) {
        data_incoming[$("#pname").html()].xvel = 0;
        data_incoming[$("#pname").html()].yvel = 0.5;
        socket.emit("move", data_incoming[$("#pname").html()]);
    }

    if (event.keyCode == 37) {

        data_incoming[$("#pname").html()].xvel = -0.5;
        data_incoming[$("#pname").html()].yvel = 0;
        socket.emit("move", data_incoming[$("#pname").html()]);

    }
    if (event.keyCode == 39) {
        data_incoming[$("#pname").html()].xvel = 0.5;
        data_incoming[$("#pname").html()].yvel = 0;
        socket.emit("move", data_incoming[$("#pname").html()]);

    }

}

//------------------------------------------------control menu moves with mouse-----------------
var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;
menu.addEventListener('mousedown', function (e) {
    isDown = true;
    offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function () {
    isDown = false;
}, true);

document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {

            x: event.clientX,
            y: event.clientY

        };
        menu.style.left = (mousePosition.x + offset[0]) + 'px';
        menu.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

//--------------------event listners-------------------------------------------

document.getElementById("ok").addEventListener("click", player.createPlayer);
document.getElementById("player").addEventListener("click", player.playerbtn);
document.getElementById("levelbtn").addEventListener("click", player.scoreboard12);
document.getElementById("startbtn").addEventListener("click", singlePlayer);
document.getElementById("back").addEventListener("click", player.backhome);
document.getElementById("login-button").addEventListener("click", player.createPlayer);
document.getElementById("hme").addEventListener("click", Game.home);
document.getElementById("hme1").addEventListener("click", Game.home);
ctrl.childNodes[3].addEventListener("click", Game.pause);
ctrl.childNodes[1].addEventListener("click", Game.play);
ctrl.childNodes[5].addEventListener("click", Game.restart);
controlMenu.addEventListener("click", Game.showControlMenu);

