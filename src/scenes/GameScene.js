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

// ---------- CLOUD LAYOUT ----------

// [xFactor, y, frame]. xFactor is a fraction of the layer width, not a world
// position: a layer with a small scrollFactor only travels a fraction of the
// level, so 1.0 means "at the far end of that layer".
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
    this.updateClouds(delta);
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
    // Back to front. The clouds come first and drift slowest, so the
    // mountains pass in front of them. All ground layers stand on the
    // ground; the tree layers are scaled down so the mountains tower
    // over them.
    this.cloudLayers = [
      this.addCloudLayer('clouds-flat', CLOUDS_FAR, 0.03, 2, 6),
      this.addCloudLayer('clouds', CLOUDS_NEAR, 0.08, 3.2, 14)
    ];
    this.addParallaxLayer(['mtn-light'], 0.1, this.GROUND_Y);
    this.addParallaxLayer(['trees-dark-a', 'trees-dark-b', 'trees-dark-c'], 0.4, this.GROUND_Y, 0.65);
  }

  // ---------- CLOUDS ----------

  // Clouds hang in the sky instead of standing on the ground, so they are
  // placed one by one rather than tiled like the tree and mountain strips.
  // The flat sheet sits furthest back, the shaded one a little closer.
  // speed is in pixels per second and is handed back to updateClouds.
  addCloudLayer(texture, clouds, scrollFactor, scale, speed) {
    const width = GAME_WIDTH + (this.LEVEL_WIDTH - GAME_WIDTH) * scrollFactor;

    const images = clouds.map(([xFactor, y, frame]) =>
      this.add.image(width * xFactor, y, texture, frame)
        .setScale(scale)
        .setScrollFactor(scrollFactor)
    );

    return { images, width, speed };
  }

  // Clouds drift left on their own, so the sky keeps moving even while the
  // player stands still. delta is the milliseconds since the last frame:
  // dividing by 1000 turns the speed into pixels per second, which keeps the
  // drift identical on a 60 Hz and a 144 Hz screen.
  updateClouds(delta) {
    const step = delta / 1000;

    this.cloudLayers.forEach(({ images, width, speed }) => {
      images.forEach(cloud => {
        cloud.x -= speed * step;

        // Once a cloud has left the layer on the left it re-enters on the
        // right. The wrap uses the layer width, not the screen width, or a
        // cloud would pop into view mid-screen when the camera sits far right.
        if (cloud.x < -cloud.displayWidth) {
          cloud.x = width + cloud.displayWidth;
        }
      });
    });
  }

  // ---------- PARALLAX ----------

  // Fills a strip with repeated frames. A scrollFactor below 1 moves the
  // layer slower than the camera, which reads as distance.
  addParallaxLayer(frames, scrollFactor, y, scale = 1, gap = 0) {
    const width = GAME_WIDTH + (this.LEVEL_WIDTH - GAME_WIDTH) * scrollFactor;
    let x = 0;
    let i = 0;

    while (x < width) {
      const image = this.add.image(x, y, 'trees-bg', frames[i % frames.length])
        .setOrigin(0, 1)
        .setScale(scale)
        .setScrollFactor(scrollFactor);

      // Without a gap the tiles overlap slightly, which hides the
      // semi-transparent frame edge that would otherwise show as a seam.
      // Rounding down matters: a fractional scale gives a fractional
      // displayWidth, and then the overlap would sometimes vanish.
      x += gap > 0 ? image.displayWidth + gap : Math.floor(image.displayWidth) - 1;
      i++;
    }
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
