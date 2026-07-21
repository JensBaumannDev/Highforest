// ============================================================
// GAME SCENE
// The playable level: ground, decoration, player and camera.
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, TILE_SCALE } from '../utils/constants.js';
import { TREE_TEXTURES } from './PreloadScene.js';
import Player from '../entities/Player.js';

// ============================================================
// LEVEL LAYOUT
// ============================================================

const LEVEL_SCREENS = 5;

const BUSH_POSITIONS = [
  80, 140, 310, 480, 520, 730, 950, 1020, 1180,
  1410, 1460, 1690, 1850, 2100, 2150, 2220, 2450, 2700, 2950, 3100, 3500,
  3580, 3640, 3810, 4020, 4240, 4560, 4660, 4720, 4830, 4900,
  5040, 5360, 5640, 5880, 5940, 6190
];

const TREE_POSITIONS = [
  120, 280, 750, 910, 1100, 1650, 2200, 2380, 2950, 3100, 3450,
  3620, 3880, 3950, 4350, 4660, 5040, 5480, 5840, 6020, 6080, 6230
];

// Largest to smallest - this order doubles as the drawing order.
const TREE_VARIANTS = [
  'tree-1a', 'tree-1b', 'tree-2a', 'tree-2b', 'tree-3a',
  'tree-3b', 'tree-4a', 'tree-4b', 'tree-5a', 'tree-5b'
];

// [xFactor, y, frame] - xFactor is a fraction of the layer width, not a world position.
const CLOUDS_FAR = [
  [0.04, 150, 'cloud-c'],
  [0.20, 110, 'cloud-f'],
  [0.35, 175, 'cloud-a'],
  [0.52, 125, 'cloud-d'],
  [0.68, 165, 'cloud-b'],
  [0.86, 130, 'cloud-e']
];

const CLOUDS_NEAR = [
  [0.10, 265, 'cloud-a'],
  [0.28, 320, 'cloud-e'],
  [0.45, 245, 'cloud-b'],
  [0.62, 300, 'cloud-d'],
  [0.78, 260, 'cloud-c'],
  [0.93, 310, 'cloud-f']
];

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
    this.updateClouds(delta);
  }

  // ============================================================
  // ENVIRONMENT
  // ============================================================

  // Draws the pinned sky and every parallax layer, back to front.
  createBackground() {
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setScrollFactor(0);

    this.cloudLayers = [
      this.addCloudLayer('clouds-flat', CLOUDS_FAR, 0.03, 2, 6),
      this.addCloudLayer('clouds', CLOUDS_NEAR, 0.08, 3.2, 14)
    ];
    this.addParallaxLayer(['mtn-light'], 0.1, this.GROUND_Y);
    this.addParallaxLayer(['trees-dark-a', 'trees-dark-b', 'trees-dark-c'], 0.4, this.GROUND_Y, 0.65);
  }

  // Places one cloud layer and returns the state updateClouds needs.
  addCloudLayer(texture, clouds, scrollFactor, scale, speed) {
    const width = GAME_WIDTH + (this.LEVEL_WIDTH - GAME_WIDTH) * scrollFactor;

    const images = clouds.map(([xFactor, y, frame]) =>
      this.add.image(width * xFactor, y, texture, frame)
        .setScale(scale)
        .setScrollFactor(scrollFactor)
    );

    return { images, width, speed };
  }

  // Drifts every cloud left and wraps it around the layer width.
  updateClouds(delta) {
    const step = delta / 1000;

    this.cloudLayers.forEach(({ images, width, speed }) => {
      images.forEach(cloud => {
        cloud.x -= speed * step;

        if (cloud.x < -cloud.displayWidth) {
          cloud.x = width + cloud.displayWidth;
        }
      });
    });
  }

  // Fills a strip with repeated frames at the given parallax depth.
  addParallaxLayer(frames, scrollFactor, y, scale = 1, gap = 0) {
    const width = GAME_WIDTH + (this.LEVEL_WIDTH - GAME_WIDTH) * scrollFactor;
    let x = 0;
    let i = 0;

    while (x < width) {
      const image = this.add.image(x, y, 'trees-bg', frames[i % frames.length])
        .setOrigin(0, 1)
        .setScale(scale)
        .setScrollFactor(scrollFactor);

      x += gap > 0 ? image.displayWidth + gap : Math.floor(image.displayWidth) - 1;
      i++;
    }
  }

  // Builds the ground row: grass collides, the dirt below is decoration.
  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    for (let x = -this.TILE_DISPLAY; x < this.LEVEL_WIDTH; x += this.TILE_DISPLAY) {
      this.platforms.create(x, this.GROUND_Y, 'tiles', TILE_GRASS)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE)
        .refreshBody();

      this.add.image(x, this.GROUND_Y + this.TILE_DISPLAY, 'tiles', TILE_DIRT)
        .setOrigin(0, 0)
        .setScale(TILE_SCALE);
    }
  }

  // Places the trees in a seeded random mix, then the bushes in front of them.
  createDecorations() {
    const rng = new Phaser.Math.RandomDataGenerator(['highforest-trees']);

    TREE_POSITIONS
      .map(x => ({
        x,
        texture: rng.pick(TREE_TEXTURES),
        size: rng.between(0, TREE_VARIANTS.length - 1)
      }))
      .sort((a, b) => b.size - a.size)
      .forEach(({ x, texture, size }) =>
        this.addTree(x, this.GROUND_Y, texture, TREE_VARIANTS[size]));

    BUSH_POSITIONS.forEach(x => this.addBush(x, this.GROUND_Y));
  }

  // Adds one tree, anchored at its foot so any size stands on the ground line.
  addTree(x, y, texture, frame) {
    return this.add.image(x, y, texture, frame).setOrigin(0.5, 1);
  }

  // Adds one bush, anchored at its foot.
  addBush(x, y) {
    return this.add.image(x, y, 'tiles', 'bush').setOrigin(0.5, 1);
  }

  // ============================================================
  // ENTITIES & CAMERA
  // ============================================================

  // Spawns the player and binds the input keys.
  createPlayer() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.player = new Player(this, 100, 170);
    this.physics.add.collider(this.player, this.platforms);
  }

  // Limits physics and camera to the level and makes the camera follow the player.
  setupCameraAndWorld() {
    this.physics.world.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.LEVEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
  }
}
