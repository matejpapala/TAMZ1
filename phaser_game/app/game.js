const ITEM_TYPES = [
    { frame: 0, points: 5,  name: 'Small Chest' },
    { frame: 1, points: 10, name: 'Open Chest' },
    { frame: 2, points: 15, name: 'Closed Chest' },
    { frame: 3, points: 20, name: 'Crate' },
    { frame: 4, points: 25, name: 'Rare Block' }
];

const PLAYER_SPEED = 150;
const ENEMY_SPEED = 80;
const GAME_DURATION = 60;
const DECREMENT_DELAY = 5000;
const DECREMENT_INTERVAL = 1000;

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 120, 'Treasure Hunter', {
            fontSize: '40px', fill: '#FFD700', fontStyle: 'bold'
        }).setOrigin(0.5);

        const topScore = localStorage.getItem('topScore') || 0;
        this.add.text(cx, cy - 50, 'Top Score: ' + topScore, {
            fontSize: '24px', fill: '#fff'
        }).setOrigin(0.5);

        const startBtn = this.add.text(cx, cy + 30, '[ Start Game ]', {
            fontSize: '30px', fill: '#0f0', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => startBtn.setStyle({ fill: '#0ff' }));
        startBtn.on('pointerout', () => startBtn.setStyle({ fill: '#0f0' }));
        startBtn.on('pointerdown', () => this.scene.start('GameScene'));

        this.add.text(cx, cy + 100, 'Arrows / Touch to move\nCollect items, avoid the bomb!', {
            fontSize: '16px', fill: '#aaa', align: 'center'
        }).setOrigin(0.5);
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.spritesheet('robot', 'assets/lego.png', { frameWidth: 37, frameHeight: 48 });
        this.load.spritesheet('items', 'assets/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('tiles', 'assets/map_tiles.png');
        this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'json_map' });
        const tiles = map.addTilesetImage('map_tiles', 'tiles');
        this.backgroundLayer = map.createLayer('background', tiles, 0, 0);
        this.collisionLayer = map.createLayer('collision', tiles, 0, 0);
        this.collisionLayer.setCollisionByExclusion([-1, 0]);

        this.mapWidth = map.widthInPixels;
        this.mapHeight = map.heightInPixels;

        this.player = this.physics.add.sprite(this.mapWidth / 2, this.mapHeight / 2, 'robot');
        this.player.setCollideWorldBounds(false);
        this.physics.add.collider(this.player, this.collisionLayer);

        if (!this.anims.exists('run')) {
            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 15 }),
                frameRate: 20,
                repeat: -1
            });
        }

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.touchDir = { x: 0, y: 0 };
        this.input.on('pointerdown', (pointer) => this.updateTouchDir(pointer, true));
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) this.updateTouchDir(pointer, true);
        });
        this.input.on('pointerup', () => { this.touchDir = { x: 0, y: 0 }; });

        this.itemsGroup = this.physics.add.group();
        this.spawnItems(5);
        this.physics.add.overlap(this.player, this.itemsGroup, this.collectItem, null, this);

        this.enemy = this.physics.add.sprite(200, 200, 'bomb');
        this.enemy.setScale(2);
        this.physics.add.collider(this.enemy, this.collisionLayer);
        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);
        this.enemyTimer = this.time.addEvent({
            delay: 2000,
            callback: this.changeEnemyDirection,
            callbackScope: this,
            loop: true
        });
        this.changeEnemyDirection();

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '20px', fill: '#fff', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setDepth(100);

        this.remainingTime = GAME_DURATION;
        this.timerText = this.add.text(this.cameras.main.width - 16, 16, 'Time: ' + GAME_DURATION, {
            fontSize: '20px', fill: '#fff', backgroundColor: '#000000aa', padding: { x: 8, y: 4 }
        }).setScrollFactor(0).setOrigin(1, 0).setDepth(100);

        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.tickTimer,
            callbackScope: this,
            loop: true
        });

        this.lastCollectTime = this.time.now;
        this.decrementing = false;
        this.decrementTimer = null;
    }

    updateTouchDir(pointer, active) {
        if (!active) {
            this.touchDir = { x: 0, y: 0 };
            return;
        }
        const cam = this.cameras.main;
        const cx = cam.width / 2;
        const cy = cam.height / 2;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;

        this.touchDir = { x: 0, y: 0 };
        if (Math.abs(dx) > Math.abs(dy)) {
            this.touchDir.x = dx > 0 ? 1 : -1;
        } else {
            this.touchDir.y = dy > 0 ? 1 : -1;
        }
    }

    spawnItems(count) {
        for (let i = 0; i < count; i++) {
            this.spawnOneItem();
        }
    }

    spawnOneItem() {
        const type = Phaser.Math.RND.pick(ITEM_TYPES);
        let x, y, tile;
        do {
            x = Phaser.Math.Between(2, 29) * 32 + 16;
            y = Phaser.Math.Between(2, 29) * 32 + 16;
            tile = this.collisionLayer.getTileAtWorldXY(x, y);
        } while (tile && tile.index !== -1 && tile.index !== 0);

        const item = this.itemsGroup.create(x, y, 'items', type.frame);
        item.setData('points', type.points);
    }

    collectItem(player, item) {
        const points = item.getData('points');
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
        item.destroy();

        this.lastCollectTime = this.time.now;
        if (this.decrementTimer) {
            this.decrementTimer.remove();
            this.decrementTimer = null;
        }
        this.decrementing = false;

        this.spawnOneItem();
    }

    hitEnemy(player, enemy) {
        this.score = 0;
        this.scoreText.setText('Score: 0');
        this.lastCollectTime = this.time.now;

        const angle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
        enemy.setPosition(
            enemy.x + Math.cos(angle) * 100,
            enemy.y + Math.sin(angle) * 100
        );
    }

    changeEnemyDirection() {
        const dir = Phaser.Math.Between(0, 3);
        const vx = [ENEMY_SPEED, -ENEMY_SPEED, 0, 0][dir];
        const vy = [0, 0, ENEMY_SPEED, -ENEMY_SPEED][dir];
        this.enemy.setVelocity(vx, vy);
    }

    tickTimer() {
        this.remainingTime--;
        this.timerText.setText('Time: ' + this.remainingTime);

        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.scene.start('GameOverScene', { score: this.score });
    }

    update(time) {
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown) vx = -1;
        else if (this.cursors.right.isDown) vx = 1;
        if (this.cursors.up.isDown) vy = -1;
        else if (this.cursors.down.isDown) vy = 1;

        if (this.touchDir.x !== 0 || this.touchDir.y !== 0) {
            vx = this.touchDir.x;
            vy = this.touchDir.y;
        }

        this.player.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);

        if (vx !== 0 || vy !== 0) {
            this.player.anims.play('run', true);
            if (Math.abs(vx) > Math.abs(vy)) {
                this.player.angle = vx > 0 ? 270 : 90;
            } else {
                this.player.angle = vy > 0 ? 180 : 0;
            }
        } else {
            this.player.anims.stop();
        }

        if (!this.decrementing && (time - this.lastCollectTime > DECREMENT_DELAY)) {
            this.decrementing = true;
            this.decrementTimer = this.time.addEvent({
                delay: DECREMENT_INTERVAL,
                callback: () => {
                    if (this.score > 0) {
                        this.score--;
                        this.scoreText.setText('Score: ' + this.score);
                    }
                },
                loop: true
            });
        }
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 120, 'Game Over', {
            fontSize: '44px', fill: '#ff4444', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(cx, cy - 50, 'Your Score: ' + this.finalScore, {
            fontSize: '28px', fill: '#fff'
        }).setOrigin(0.5);

        const topScore = parseInt(localStorage.getItem('topScore') || '0', 10);
        if (this.finalScore > topScore) {
            localStorage.setItem('topScore', this.finalScore);
            this.add.text(cx, cy, 'New High Score!', {
                fontSize: '24px', fill: '#FFD700', fontStyle: 'bold'
            }).setOrigin(0.5);
        } else {
            this.add.text(cx, cy, 'Top Score: ' + topScore, {
                fontSize: '24px', fill: '#aaa'
            }).setOrigin(0.5);
        }

        const menuBtn = this.add.text(cx, cy + 70, '[ Back to Menu ]', {
            fontSize: '28px', fill: '#0f0', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#0ff' }));
        menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#0f0' }));
        menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
