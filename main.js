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

    // ゲーム開始時間を記録
    Game.startTime = Date.now();
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
        count: 0,
        production: 1 // 秒間1クリック
    },
    scoreBoost: {
        cost: 100,
        interval: 1000, // 1秒
        production: 5,
        count: 0
    },
    upgrade: {
        cost: 300,
        purchased: false
    },
    clicksPerSecond: 0,
    totalClicksPerSecond: 0,
    game2: {
        playerX: 300,
        playerY: 300,
        playerSpeed: 5,
        playerSize: 20,
        bullets: [],
        enemies: [],
        range: 150, // 射程範囲を追加
        lastShotTime: 0, // 最後に弾を発射した時間
        shotInterval: 500 // 弾を発射する間隔（ミリ秒）
    }
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

// アップグレードボタンを追加
var upgradeButton = document.createElement('button');
upgradeButton.id = 'upgradeButton';
upgradeButton.innerText = '自動クリック君のアップグレード (300スコア)';
upgradeButton.style.position = 'absolute';
upgradeButton.style.top = '10px';
upgradeButton.style.right = '10px';
document.body.appendChild(upgradeButton);

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
    Game.variables.clicksPerSecond = (Game.variables.autoClicker.count * Game.variables.autoClicker.production) + (Game.variables.scoreBoost.count * Game.variables.scoreBoost.production);
    Game.variables.totalClicksPerSecond = Game.variables.clicksPerSecond; // プレイヤーのクリックを含む場合は別途加算
    cpsElement.innerText = '秒間スコア (クリックは含まない): ' + Game.variables.clicksPerSecond;
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

// アップグレードの購入処理
upgradeButton.addEventListener('click', function () {
    if (Game.variables.score >= Game.variables.upgrade.cost && !Game.variables.upgrade.purchased) {
        Game.variables.score -= Game.variables.upgrade.cost;
        Game.updateScore();
        Game.variables.autoClicker.production = 2; // 秒間2クリックにアップグレード
        Game.variables.upgrade.purchased = true;
        upgradeButton.disabled = true;
        upgradeButton.innerText = '自動クリック君のアップグレード (購入済み)';
        Game.updateProductionRates();
    }
});

// 自動クリック君とスコアブースト君の処理をまとめる
setInterval(function () {
    if (Game.variables.autoClicker.count > 0) {
        Game.variables.score += Game.variables.autoClicker.count * Game.variables.autoClicker.production;
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
    }
});

/*=====================================================================================
MAIN LOOP
=======================================================================================*/
Game.loop = function () {
    Game.update();
    Game.draw();
    Game.updateGame2();
    Game.drawGame2();
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
};

Game.updateGame2 = function () {
    // ゲーム開始からの経過時間を計算
    var elapsedTime = (Date.now() - Game.startTime) / 1000; // 秒単位

    // 敵の生成
    var enemySpawnRate = elapsedTime < 30 ? 0.005 : 0.02; // 30秒間はゆっくり、その後は通常速度
    if (Math.random() < enemySpawnRate) {
        var enemy = {
            x: Math.random() * 400,
            y: Math.random() * 600,
            size: 20,
            speed: 2
        };
        Game.variables.game2.enemies.push(enemy);
    }

    // 敵の移動
    Game.variables.game2.enemies.forEach(function (enemy) {
        var dx = Game.variables.game2.playerX - enemy.x;
        var dy = Game.variables.game2.playerY - enemy.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
    });

    // 弾の移動
    Game.variables.game2.bullets.forEach(function (bullet, index) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        // 画面外に出た弾を削除
        if (bullet.x < 0 || bullet.x > 400 || bullet.y < 0 || bullet.y > 600) {
            Game.variables.game2.bullets.splice(index, 1);
        }
    });

    // 弾と敵の衝突判定
    Game.variables.game2.bullets.forEach(function (bullet, bulletIndex) {
        Game.variables.game2.enemies.forEach(function (enemy, enemyIndex) {
            var dx = bullet.x - enemy.x;
            var dy = bullet.y - enemy.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < bullet.size + enemy.size) {
                Game.variables.game2.bullets.splice(bulletIndex, 1);
                Game.variables.game2.enemies.splice(enemyIndex, 1);
            }
        });
    });

    // 自動で弾を発射
    var currentTime = Date.now();
    if (Game.variables.score > 0 && Game.variables.game2.enemies.length > 0 && currentTime - Game.variables.game2.lastShotTime >= Game.variables.game2.shotInterval) {
        var closestEnemy = null;
        var closestDist = Infinity;
        Game.variables.game2.enemies.forEach(function (enemy) {
            var dx = Game.variables.game2.playerX - enemy.x;
            var dy = Game.variables.game2.playerY - enemy.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist && dist <= Game.variables.game2.range) { // 射程範囲内の敵をターゲットにする
                closestDist = dist;
                closestEnemy = enemy;
            }
        });

        if (closestEnemy) {
            var dx = closestEnemy.x - Game.variables.game2.playerX;
            var dy = closestEnemy.y - Game.variables.game2.playerY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var bullet = {
                x: Game.variables.game2.playerX,
                y: Game.variables.game2.playerY,
                vx: (dx / dist) * 5,
                vy: (dy / dist) * 5,
                size: 5
            };
            Game.variables.game2.bullets.push(bullet);
            Game.variables.score--;
            Game.updateScore();
            Game.variables.game2.lastShotTime = currentTime; // 最後に弾を発射した時間を更新
        }
    }
};

Game.drawGame2 = function () {
    // 右側のゲームの描画
    var canvas2 = getElementById('gameCanvas2');
    var ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    // プレイヤーの描画
    ctx2.fillStyle = 'blue';
    ctx2.fillRect(Game.variables.game2.playerX, Game.variables.game2.playerY, Game.variables.game2.playerSize, Game.variables.game2.playerSize);

    // 弾の描画
    ctx2.fillStyle = 'green';
    Game.variables.game2.bullets.forEach(function (bullet) {
        ctx2.beginPath();
        ctx2.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx2.fill();
    });

    // 敵の描画
    ctx2.fillStyle = 'red';
    Game.variables.game2.enemies.forEach(function (enemy) {
        ctx2.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
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