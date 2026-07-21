import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload() {
    this.load.image('background', 'assets/environment/background/Background.png');
    this.load.image('trees-dark', 'assets/environment/trees/trees-dark-combined.png');
    this.load.image('trees-light', 'assets/environment/trees/trees-light-combined.png');
    this.load.image('mountains', 'assets/environment/trees/mountains.png');
    this.load.image('tiles-bush', 'assets/environment/tiles/Tiles.png');
    this.load.spritesheet('tree1', 'assets/environment/trees/Yellow-Tree.png', { frameWidth: 115, frameHeight: 300 });
    this.load.spritesheet('tiles', 'assets/environment/tiles/Tiles.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player-idle', 'assets/character/idle/Idle-Sheet.png', { frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet('player-run', 'assets/character/run/Run-Sheet.png', { frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet('player-jump', 'assets/character/jump/Jump-All-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player-attack', 'assets/character/attack/Attack-01-Sheet.png', { frameWidth: 64, frameHeight: 80 });
  }

  create() {

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player-jump', { start: 0, end: 14 }),
      frameRate: 14,
      repeat: -1
    });

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('player-attack', { start: 0, end: 11 }),
      frameRate: 12,
      repeat: 0
    });

    this.scene.start(SCENES.MENU);
  }
}
