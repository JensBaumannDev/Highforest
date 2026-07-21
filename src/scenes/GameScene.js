// ============================================================
// GAME SCENE
// The playable level: ground, decoration, player and camera.
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, TILE_SCALE } from '../utils/constants.js';
import Player from '../entities/Player.js';

// ---------- LEVEL LAYOUT ----------

const LEVEL_SCREENS = 3;

const BUSH_POSITIONS = [
  80, 140, 310, 480, 520, 730, 950, 1020, 1180,
  1410, 1460, 1690, 1850, 2100, 2150, 2220, 2450, 2700, 2950, 3100, 3500
];

const TREE_POSITIONS = [
  120, 280, 750, 910, 1100, 1650, 2200, 2380, 2950, 3100, 3450
];

// Frame indices in the tile sheet
const TILE_GRASS = 27;
const TILE_DIRT = 52;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  // ============================================================
  // LIFECYCLE
  // ============================================================

  create() {
    this.LEVEL_WIDTH = GAME_WIDTH * LEVEL_SCREENS;
    this.TILE_DISPLAY = TILE_SIZE * TILE_SCALE;
    this.GROUND_Y = GAME_HEIGHT - this.TILE_DISPLAY * 2;

    this.createBackground();
    this.createPlatforms();
    this.createDecorations();
    this.createPlayer();
    this.setupCameraAndWorld();

    this.scene.launch(SCENES.HUD);
  }

  update(time, delta) {
    this.player.update(this.cursors, this.attackKey);
  }

  // ============================================================
  // ENVIRONMENT
  // ============================================================

  // ---------- BACKGROUND ----------

  // scrollFactor 0 pins the sky to the camera, so it never moves.
  createBackground() {
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setScrollFactor(0);
  }

  // ---------- GROUND ----------

  // Starts one tile left of zero so there is no gap at the level edge.
  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    for (let x = -this.TILE_DISPLAY; x < this.LEVEL_WIDTH; x += this.TILE_DISPLAY) {
      // Grass surface (collision)
      this.platforms.create(x, this.GROUND_Y, 'tiles', TILE_GRASS)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE)
        .refreshBody();

      // Dirt below (visual only)
      this.add.image(x, this.GROUND_Y + this.TILE_DISPLAY, 'tiles', TILE_DIRT)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE);
    }
  }

  // ---------- DECORATION ----------

  // Trees first, so the bushes are drawn in front of the trunks.
  createDecorations() {
    TREE_POSITIONS.forEach(x => this.addTree(x, this.GROUND_Y));
    BUSH_POSITIONS.forEach(x => this.addBush(x, this.GROUND_Y));
  }

  // Origin (0.5, 1) means "bottom centre": the anchor sits at the
  // foot of the sprite, so y is simply the ground height.
  addTree(x, y) {
    return this.add.image(x, y, 'tree1', 0).setOrigin(0.5, 1);
  }

  addBush(x, y) {
    return this.add.image(x, y, 'tiles', 'bush').setOrigin(0.5, 1);
  }

  // ============================================================
  // ENTITIES & CAMERA
  // ============================================================

  // ---------- PLAYER ----------

  createPlayer() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.player = new Player(this, 100, 170);
    this.physics.add.collider(this.player, this.platforms);
  }

  // ---------- CAMERA & WORLD BOUNDS ----------

  setupCameraAndWorld() {
    this.physics.world.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }
}
