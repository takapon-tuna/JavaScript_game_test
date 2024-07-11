

var VERSION = 0.001;
var BETA = 1;

/*=====================================================================================
MISC HELPER FUNCTIONS
=======================================================================================*/
function getElementById(id) {
    return document.getElementById(id);
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
    let counter = array.length, temp, index;
    while (counter--) {
        index = (Math.random() * counter) | 0;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

/*=====================================================================================
GAME INITIALIZATION
=======================================================================================*/
var Game = {};

Game.init = function () {
    Game.version = VERSION;
    Game.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    Game.touchEvents = 'ontouchstart' in document.documentElement;

    // Load resources
    Game.loadResources();
};

Game.loadResources = function () {
    // リソースのロード処理
    console.log("Resources loaded.");
};

/*=====================================================================================
VARIABLES AND PRESETS
=======================================================================================*/
Game.variables = {
    score: 0,
    highScore: 0,
    player: {
        x: 0,
        y: 0,
        speed: 5
    }
};

/*=====================================================================================
MAIN LOOP
=======================================================================================*/
Game.loop = function () {
    Game.update();
    Game.draw();
    requestAnimationFrame(Game.loop);
};

Game.update = function () {
    // ゲームロジックの更新
    Game.variables.player.x += Game.variables.player.speed;
};

Game.draw = function () {
    // ゲームの描画
    var canvas = getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(Game.variables.player.x, Game.variables.player.y, 50, 50);
};

/*=====================================================================================
LAUNCH THIS THING
=======================================================================================*/
Game.launch = function () {
    Game.init();
    Game.loop();
};

window.onload = function () {
    Game.launch();
};