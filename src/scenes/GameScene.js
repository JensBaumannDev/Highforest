import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';
import Player from '../entities/Player.js';
import Snail from '../entities/Snail.js';
import Boar from '../entities/Boar.js';
import Bee from '../entities/Bee.js';
import Collectible from '../objects/Collectible.js';
import Platform from '../objects/Platform.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  // ==========================================
  // LIFECYCLE METHODS
  // ==========================================

  create() {
    this.LEVEL_WIDTH = GAME_WIDTH * 3;

    this.createBackground();
    this.createPlatforms();
    this.createDecorations();
    this.createPlayer();
    this.setupCameraAndWorld();

    this.scene.launch(SCENES.HUD);
  }

  update(time, delta) {
    this.player.update(this.cursors, this.attackKey);

    // Parallax scrolling
    const cam = this.cameras.main;
  }

  // ==========================================
  // ENVIRONMENT & SETUP METHODS
  // ==========================================

  createBackground() {
    // Sky background (static)
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setScrollFactor(0);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    const TILE_SCALE = 4;
    const TILE_DISPLAY = 16 * TILE_SCALE;

    for (let x = -TILE_DISPLAY; x < this.LEVEL_WIDTH; x += TILE_DISPLAY) {
      // Grass surface (collision)
      this.platforms.create(x, GAME_HEIGHT - TILE_DISPLAY * 2, 'tiles', 27)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE)
        .refreshBody();

      // Dirt below (visual only)
      this.add.image(x, GAME_HEIGHT - TILE_DISPLAY, 'tiles', 52)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE);
    }
  }

  createDecorations() {
    const bushPositions = [
      80, 140, 310, 480, 520, 730, 950, 1020, 1180,
      1410, 1460, 1690, 1850, 2100, 2150, 2220, 2450, 2700, 2950, 3100, 3500
    ];


    const treePositions = [
      120, 280, 750, 910, 1100, 1650, 2200, 2380, 2950, 3100, 3450
    ];

    treePositions.forEach(x => this.addTree(x, 790));
    bushPositions.forEach(x => this.addBush(x, 790));
  }

  addTree(x, y) {
    const tree = this.add.image(x, y, 'tree1', 0);
    tree.setOrigin(0.5, 1.49);
    tree.setScale(1);
    return tree;
  }


  addBush(x, y) {
    const bush = this.add.image(x, y, 'tiles-bush');
    bush.setCrop(280, 0, 150, 50);
    bush.setOrigin(0.5, 0.49);
    return bush;
  }


  // ==========================================
  // ENTITIES & CAMERA SETUP
  // ==========================================

  createPlayer() {
    // Controls setup
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Player instantiation & collision
    this.player = new Player(this, 100, 170);
    this.physics.add.collider(this.player, this.platforms);
  }

  setupCameraAndWorld() {
    this.physics.world.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }
}