// ============================================================
// PRELOAD SCENE
// Loads every asset and registers the animations, so the rest
// of the game can just reference them by key.
// ============================================================

import Phaser from 'phaser';
import { SCENES, TILE_SIZE } from '../utils/constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  // ============================================================
  // ASSET LOADING
  // ============================================================

  preload() {
    this.loadEnvironment();
    this.loadCharacter();
  }

  // ---------- ENVIRONMENT ----------

  loadEnvironment() {
    this.load.image('background', 'assets/environment/background/Background.png');
    this.load.spritesheet('tree1', 'assets/environment/trees/Yellow-Tree.png', { frameWidth: 115, frameHeight: 300 });
    this.load.spritesheet('tiles', 'assets/environment/tiles/Tiles.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
  }

  // ---------- CHARACTER ----------

  // Frame sizes differ per sheet: the attack is 96 wide because the
  // sword swing reaches past the body. Slicing it at 64 cuts the
  // swing off and scrambles the frame order.
  loadCharacter() {
    this.load.spritesheet('player-idle', 'assets/character/idle/Idle-Sheet.png', { frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet('player-run', 'assets/character/run/Run-Sheet.png', { frameWidth: 64, frameHeight: 80 });
    this.load.spritesheet('player-jump', 'assets/character/jump/Jump-All-Sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player-attack', 'assets/character/attack/Attack-01-Sheet.png', { frameWidth: 96, frameHeight: 80 });
  }

  // ============================================================
  // SETUP
  // ============================================================

  create() {
    this.createPlayerAnimations();
    this.createCustomFrames();

    this.scene.start(SCENES.MENU);
  }

  // ---------- PLAYER ANIMATIONS ----------

  // repeat: -1 loops forever, repeat: 0 plays once.
  createPlayerAnimations() {
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
      frames: this.anims.generateFrameNumbers('player-attack', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: 0
    });
  }

  // ---------- CUSTOM TEXTURE FRAMES ----------

  // The bush does not sit on the 16px tile grid, so it gets its own
  // named region on the tile texture instead of a second image load.
  createCustomFrames() {
    this.textures.get('tiles').add('bush', 0, 280, 0, 120, 48);
  }
}
