// ============================================================
// GAME SCENE
// The playable level: ground, decoration, player and camera.
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, TILE_SCALE } from '../utils/constants.js';
import { TREE_TEXTURES } from './PreloadScene.js';
import Player from '../entities/Player.js';

// ============================================================
// LEVEL DATA
// ============================================================

const LEVEL = {
  screens: 5,

  // Gaps in the ground, each spanned by a bridge: [x, width] in tiles.
  waterGaps: [[18, 5], [44, 6], [72, 5]],

  // Loose rocks flanking each bridge head, decoration only.
  rockFrames: ['rock-mid', 'rock-small'],

  bushes: [
    80, 140, 310, 480, 520, 730, 950, 1020, 1180,
    1410, 1460, 1690, 1850, 2100, 2150, 2220, 2450, 2700, 2950, 3100, 3500,
    3580, 3640, 3810, 4020, 4240, 4560, 4660, 4720, 4830, 4900,
    5040, 5360, 5640, 5880, 5940, 6190
  ],

  trees: [
    120, 280, 750, 910, 1100, 1650, 2200, 2380, 2950, 3100, 3450,
    3620, 3880, 3950, 4350, 4660, 5040, 5480, 5840, 6020, 6080, 6230
  ],

  // Largest to smallest - this order doubles as the drawing order.
  treeVariants: [
    'tree-1a', 'tree-1b', 'tree-2a', 'tree-2b', 'tree-3a',
    'tree-3b', 'tree-4a', 'tree-4b', 'tree-5a', 'tree-5b'
  ]
};

// ============================================================
// TILE FRAMES
// ============================================================

// Side entries read [left, right]; lists are cycled for variation.
const TILES = {
  grass: { left: 25, mid: 27, right: 29 },
  dirt: { left: 50, mid: 52, right: 54 },
  bush: 'bush',
  water: { top: [481, 482, 483, 484], body: [506, 507, 508, 509] },
  bridge: {
    postTop: [180, 184],
    post: [205, 209],
    rope: [206, 208],
    plank: 207,
    end: [230, 234],
    body: [231, 232, 233]
  }
};

// [xFactor, y, frame] - xFactor is a fraction of the layer width, not a world position.
const CLOUDS = {
  far: [
    [0.04, 150, 'cloud-c'], [0.20, 110, 'cloud-f'], [0.35, 175, 'cloud-a'],
    [0.52, 125, 'cloud-d'], [0.68, 165, 'cloud-b'], [0.86, 130, 'cloud-e']
  ],
  near: [
    [0.10, 265, 'cloud-a'], [0.28, 320, 'cloud-e'], [0.45, 245, 'cloud-b'],
    [0.62, 300, 'cloud-d'], [0.78, 260, 'cloud-c'], [0.93, 310, 'cloud-f']
  ]
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  // ============================================================
  // LIFECYCLE
  // ============================================================

  create() {
    this.LEVEL_WIDTH = GAME_WIDTH * LEVEL.screens;
    this.TILE_DISPLAY = TILE_SIZE * TILE_SCALE;
    this.LEVEL_TILES = this.LEVEL_WIDTH / this.TILE_DISPLAY;
    this.GROUND_ROW = GAME_HEIGHT / this.TILE_DISPLAY - 2;
    this.GROUND_Y = this.GROUND_ROW * this.TILE_DISPLAY;

    this.createBackground();
    this.createPlatforms();
    this.createRocks();
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
  // BACKGROUND
  // ============================================================

  // Draws the pinned sky and every parallax layer, back to front.
  createBackground() {
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setScrollFactor(0);

    this.cloudLayers = [
      this.addCloudLayer('clouds-flat', CLOUDS.far, 0.03, 2, 6),
      this.addCloudLayer('clouds', CLOUDS.near, 0.08, 3.2, 14)
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

  // ============================================================
  // TERRAIN
  // ============================================================

  // Builds the ground row with its water gaps, then bridges every gap.
  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    for (let x = -1; x <= this.LEVEL_TILES; x++) {
      if (this.isWater(x)) {
        this.addWater(x);
      } else {
        this.addGround(x);
      }
    }

    LEVEL.waterGaps.forEach(([x, width]) => this.addBridge(x, width));
  }

  // True while the given tile column belongs to a water gap.
  isWater(tileX) {
    return LEVEL.waterGaps.some(([x, width]) => tileX >= x && tileX < x + width);
  }

  // Adds one ground column, switching to the bank tiles next to water.
  addGround(tileX) {
    const side = this.isWater(tileX + 1) ? 'right' : this.isWater(tileX - 1) ? 'left' : 'mid';

    // The bank tiles have a fully transparent edge column, so the water is
    // repeated underneath them - otherwise the sky shows through at the shore.
    if (side !== 'mid') {
      this.addWater(tileX);
    }

    this.addSolidTile(tileX, this.GROUND_ROW, TILES.grass[side]);
    this.addTile(tileX, this.GROUND_ROW + 1, TILES.dirt[side]);
  }

  // Fills a gap column with water: crest at ground level, body below it.
  addWater(tileX) {
    const { top, body } = TILES.water;

    this.addTile(tileX, this.GROUND_ROW, top[tileX % top.length]);
    this.addTile(tileX, this.GROUND_ROW + 1, body[tileX % body.length]);
  }

  // Lays the three bridge rows across a gap and makes the deck walkable.
  addBridge(tileX, tileWidth) {
    const { postTop, post, rope, plank, end, body } = TILES.bridge;
    const deckRow = this.GROUND_ROW - 1;

    [tileX - 1, tileX + tileWidth].forEach((x, side) => {
      this.addTile(x, deckRow - 1, postTop[side]);
      this.addTile(x, deckRow, post[side]);
      this.addTile(x, this.GROUND_ROW, end[side]);
    });

    for (let i = 0; i < tileWidth; i++) {
      const deck = i === 0 ? rope[0] : i === tileWidth - 1 ? rope[1] : plank;

      this.addTile(tileX + i, deckRow, deck);
      this.addTile(tileX + i, this.GROUND_ROW, body[i % body.length]);

      // The planks sit at the bottom of the rope row, so the body that carries
      // the player is an invisible tile one row further down.
      this.addSolidTile(tileX + i, this.GROUND_ROW, TILES.grass.mid).setVisible(false);
    }
  }

  // Adds a tile the player collides with.
  addSolidTile(tileX, tileY, frame) {
    return this.platforms
      .create(tileX * this.TILE_DISPLAY, tileY * this.TILE_DISPLAY, 'tiles', frame)
      .setOrigin(0, 0)
      .setScale(TILE_SCALE)
      .refreshBody();
  }

  // Adds a tile that is purely decoration.
  addTile(tileX, tileY, frame) {
    return this.add
      .image(tileX * this.TILE_DISPLAY, tileY * this.TILE_DISPLAY, 'tiles', frame)
      .setOrigin(0, 0)
      .setScale(TILE_SCALE);
  }

  // ============================================================
  // DECORATION
  // ============================================================

  // Places the trees in a seeded random mix, then the bushes in front of them.
  createDecorations() {
    const rng = new Phaser.Math.RandomDataGenerator(['highforest-trees']);
    const onLand = x => !this.isWater(Math.floor(x / this.TILE_DISPLAY));

    LEVEL.trees
      .filter(onLand)
      .map(x => ({
        x,
        texture: rng.pick(TREE_TEXTURES),
        size: rng.between(0, LEVEL.treeVariants.length - 1)
      }))
      .sort((a, b) => b.size - a.size)
      .forEach(({ x, texture, size }) =>
        this.addProp(x, texture, LEVEL.treeVariants[size]));

    LEVEL.bushes.filter(onLand).forEach(x => this.addProp(x, 'tiles', TILES.bush));
  }

  // Drops a rock on each bank next to a bridge, purely for looks.
  // The rock sheet shares the pixel density of the tiles, so it shares TILE_SCALE.
  createRocks() {
    LEVEL.waterGaps.forEach(([x, width], gap) => {
      [x - 2, x + width + 1].forEach((tileX, side) => {
        const frame = LEVEL.rockFrames[(gap + side) % LEVEL.rockFrames.length];

        this.addProp((tileX + 0.5) * this.TILE_DISPLAY, 'rocks', frame, TILE_SCALE);
      });
    });
  }

  // Adds a prop anchored at its foot, so any size stands on the ground line.
  addProp(x, texture, frame, scale = 1) {
    return this.add.image(x, this.GROUND_Y, texture, frame).setOrigin(0.5, 1).setScale(scale);
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
