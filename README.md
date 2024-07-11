# 2D�Q�[���t���[�����[�N

## �T�v
����2D�Q�[���t���[�����[�N�́A�u���E�U��œ��삷��V���v����2D�Q�[�����쐬���邽�߂̊�{�I�ȋ@�\��񋟂��܂��B�ȉ��̃K�C�h�ł́A�t���[�����[�N�̃Z�b�g�A�b�v�A��{�I�Ȏg�p���@�A�J�X�^�}�C�Y���@�ɂ��Đ������܂��B

## �Z�b�g�A�b�v

### 1. HTML�t�@�C���̍쐬
�܂��A�Q�[����\�����邽�߂�HTML�t�@�C�����쐬���܂��B�ȉ��͊�{�I��HTML�e���v���[�g�ł��B

html
<!DOCTYPE html>
  <html lang="ja">
    <head>
  <meta charset="UTF-8">
  <title>2D�Q�[���t���[�����[�N</title>
  <style>
canvas {
border: 1px solid black;
}
</style>
  </head>
    <body>
      <canvas id="gameCanvas" width="800" height="600"></canvas>
      <script src="framework.js"></script>
      <script src="main.js"></script>
    </body>
</html>


### 2. �t���[�����[�N�̃C���N���[�h
��L��HTML�e���v���[�g�ł́A`framework.js` �� `main.js` ���C���N���[�h���Ă��܂��B`framework.js` �̓t���[�����[�N�̖{�̂ŁA`main.js` �̓Q�[���̃��W�b�N���L�q����t�@�C���ł��B

## ��{�I�Ȏg�p���@

### 1. �t���[�����[�N�̏�����
`main.js` �t�@�C���ŁA�t���[�����[�N�����������A�Q�[�����[�v���J�n���܂��B
javascript:main.js
window.onload = function() {
Game.launch();
};

### 2. �Q�[���̏�����
`Game.init` �֐����ŁA�Q�[���̏����ݒ�⃊�\�[�X�̃��[�h���s���܂��B
javascript:main.js
Game.init = function() {
Game.version = "1.0.0";
Game.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
Game.touchEvents = 'ontouchstart' in document.documentElement;
// ���\�[�X�̃��[�h
Game.loadResources();
};
Game.loadResources = function() {
console.log("Resources loaded.");
};

### 3. �Q�[�����[�v�̎���
`Game.loop` �֐����ŁA�Q�[���̏�Ԃ��X�V���A��ʂ��ĕ`�悵�܂��B
javascript:main.js
Game.loop = function() {
Game.update();
Game.draw();
requestAnimationFrame(Game.loop);
};
Game.update = function() {
// �Q�[�����W�b�N�̍X�V
Game.variables.player.x += Game.variables.player.speed;
};
Game.draw = function() {
// �Q�[���̕`��
var canvas = getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillRect(Game.variables.player.x, Game.variables.player.y, 50, 50);
};

## �J�X�^�}�C�Y���@

### 1. �Q�[���ϐ��̐ݒ�
`Game.variables` �I�u�W�F�N�g���ŁA�Q�[���̕ϐ��⏉���ݒ���s���܂��B
javascript:main.js
Game.variables = {
score: 0,
highScore: 0,
player: {
x: 0,
y: 0,
speed: 5
}
};

### 3. �J�X�^�����W�b�N�̒ǉ�
`Game.mods.customLogic` �z��ɃJ�X�^�����W�b�N��ǉ��ł��܂��B

## �܂Ƃ�
����2D�Q�[���t���[�����[�N�́A�V���v����2D�Q�[����v���ɊJ�����邽�߂̊�{�I�ȋ@�\��񋟂��܂��B�t���[�����[�N���g�p���āA�Ǝ��̃Q�[�����W�b�N��J�X�^���@�\��ǉ����A�I���W�i���̃Q�[�����쐬���Ă��������B