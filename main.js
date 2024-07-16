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

    // スコアを初期化
    Game.updateScore();
    Game.updateProductionRates();
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
    },
    clickButton: {
        x: 350,
        y: 250,
        width: 100,
        height: 100
    },
    autoClicker: {
        cost: 10,
        interval: 1000, // 1秒
        count: 0
    },
    scoreBoost: {
        cost: 100,
        interval: 1000, // 1秒
        production: 5,
        count: 0
    },
    clicksPerSecond: 0,
    totalClicksPerSecond: 0
};

// スコアを表示するための要素を追加
var scoreElement = document.createElement('div');
scoreElement.id = 'score';
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.fontSize = '40px';
scoreElement.style.color = 'black';
document.body.appendChild(scoreElement);

// 自動クリック君の数を表示するための要素を追加
var autoClickerCountElement = document.createElement('div');
autoClickerCountElement.id = 'autoClickerCount';
autoClickerCountElement.style.position = 'absolute';
autoClickerCountElement.style.top = '60px';
autoClickerCountElement.style.left = '300px';
autoClickerCountElement.style.fontSize = '24px';
autoClickerCountElement.style.color = 'black';
document.body.appendChild(autoClickerCountElement);

// スコアブースト君の数を表示するための要素を追加
var scoreBoostCountElement = document.createElement('div');
scoreBoostCountElement.id = 'scoreBoostCount';
scoreBoostCountElement.style.position = 'absolute';
scoreBoostCountElement.style.top = '110px';
scoreBoostCountElement.style.left = '300px';
scoreBoostCountElement.style.fontSize = '24px';
scoreBoostCountElement.style.color = 'black';
document.body.appendChild(scoreBoostCountElement);

// 秒間スコアを表示するための要素を追加
var cpsElement = document.createElement('div');
cpsElement.id = 'cps';
cpsElement.style.position = 'absolute';
cpsElement.style.top = '160px';
cpsElement.style.left = '300px';
cpsElement.style.fontSize = '24px';
cpsElement.style.color = 'black';
document.body.appendChild(cpsElement);

var totalCpsElement = document.createElement('div');
totalCpsElement.id = 'totalCps';
totalCpsElement.style.position = 'absolute';
totalCpsElement.style.top = '190px';
totalCpsElement.style.left = '10px';
totalCpsElement.style.fontSize = '24px';
totalCpsElement.style.color = 'black';
document.body.appendChild(totalCpsElement);

// 自動クリック君の購入ボタンを追加
var autoClickerButton = document.createElement('button');
autoClickerButton.id = 'autoClickerButton';
autoClickerButton.innerText = '自動クリック君を購入 (10スコア)';
autoClickerButton.style.position = 'absolute';
autoClickerButton.style.top = '70px';
autoClickerButton.style.left = '10px';
document.body.appendChild(autoClickerButton);

// スコアブースト君の購入ボタンを追加
var scoreBoostButton = document.createElement('button');
scoreBoostButton.id = 'scoreBoostButton';
scoreBoostButton.innerText = 'スコアブースト君を購入 (100スコア)';
scoreBoostButton.style.position = 'absolute';
scoreBoostButton.style.top = '110px';
scoreBoostButton.style.left = '10px';
document.body.appendChild(scoreBoostButton);

// スコアを更新する関数
Game.updateScore = function () {
    scoreElement.innerText = 'Score: ' + Game.variables.score;
};

// 自動クリック君の数を更新する関数
Game.updateAutoClickerCount = function () {
    autoClickerCountElement.innerText = '自動クリック君の数: ' + Game.variables.autoClicker.count;
};

// スコアブースト君の数を更新する関数
Game.updateScoreBoostCount = function () {
    scoreBoostCountElement.innerText = 'スコアブースト君の数: ' + Game.variables.scoreBoost.count;
};

// 秒間スコアを更新する関数
Game.updateProductionRates = function () {
    Game.variables.clicksPerSecond = Game.variables.autoClicker.count + (Game.variables.scoreBoost.count * Game.variables.scoreBoost.production);
    Game.variables.totalClicksPerSecond = Game.variables.clicksPerSecond; // プレイヤーのクリックを含む場合は別途加算
    cpsElement.innerText = '秒間スコア (クリック含まず): ' + Game.variables.clicksPerSecond;
    // totalCpsElement.innerText = '秒間スコア (クリック含む): ' + Game.variables.totalClicksPerSecond;
};

// 自動クリック君の購入処理
autoClickerButton.addEventListener('click', function () {
    if (Game.variables.score >= Game.variables.autoClicker.cost) {
        Game.variables.score -= Game.variables.autoClicker.cost;
        Game.updateScore();
        Game.variables.autoClicker.count++;
        Game.updateAutoClickerCount();
        Game.updateProductionRates();
        Game.variables.autoClicker.cost = Math.floor(Game.variables.autoClicker.cost * 1.3);
        autoClickerButton.innerText = '自動クリック君を購入 (' + Game.variables.autoClicker.cost + 'スコア)';
    }
});

// スコアブースト君の購入処理
scoreBoostButton.addEventListener('click', function () {
    if (Game.variables.score >= Game.variables.scoreBoost.cost) {
        Game.variables.score -= Game.variables.scoreBoost.cost;
        Game.updateScore();
        Game.variables.scoreBoost.count++;
        Game.updateScoreBoostCount();
        Game.updateProductionRates();
        Game.variables.scoreBoost.cost = Math.floor(Game.variables.scoreBoost.cost * 1.15);
        scoreBoostButton.innerText = 'スコアブースト君を購入 (' + Game.variables.scoreBoost.cost + 'スコア)';
    }
});

// 自動クリック君とスコアブースト君の処理をまとめる
setInterval(function () {
    if (Game.variables.autoClicker.count > 0) {
        Game.variables.score += Game.variables.autoClicker.count;
    }
    if (Game.variables.scoreBoost.count > 0) {
        Game.variables.score += Game.variables.scoreBoost.count * Game.variables.scoreBoost.production;
    }
    Game.updateScore();
    Game.updateProductionRates();
}, Game.variables.autoClicker.interval);

// クリックイベントを追加
document.getElementById('gameCanvas').addEventListener('click', function (event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (x >= Game.variables.clickButton.x && x <= Game.variables.clickButton.x + Game.variables.clickButton.width &&
        y >= Game.variables.clickButton.y && y <= Game.variables.clickButton.y + Game.variables.clickButton.height) {
        Game.variables.score++;
        Game.updateScore();
        Game.variables.totalClicksPerSecond++; // プレイヤーのクリックを含む場合
        Game.updateProductionRates();
    }
});

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

    // クリックボタンの描画
    ctx.fillStyle = 'red';
    ctx.fillRect(Game.variables.clickButton.x, Game.variables.clickButton.y, Game.variables.clickButton.width, Game.variables.clickButton.height);

    // プレイヤーの描画
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(Game.variables.player.x, Game.variables.player.y, 50, 50);
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