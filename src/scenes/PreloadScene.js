// ============================================================
// PRELOAD SCENE
// Loads every asset and registers the animations, so the rest
// of the game can just reference them by key.
// ============================================================

import Phaser from 'phaser';
import { SCENES, TILE_SIZE } from '../utils/constants.js';

// ============================================================
// TEXTURE REGIONS
// ============================================================

// [name, x, y, width, height] - both cloud sheets share this layout.
const CLOUD_FRAMES = [
  ['cloud-a', 8, 13, 60, 35],
  ['cloud-b', 81, 13, 30, 35],
  ['cloud-c', 8, 55, 34, 29],
  ['cloud-d', 67, 55, 50, 29],
  ['cloud-e', 16, 86, 41, 31],
  ['cloud-f', 72, 86, 31, 31]
];

// [name, x, y, width, height] - five tree sizes, measured out because the
// rows have different heights and cannot be grid-sliced.
const TREE_FRAMES = [
  ['tree-1', 0, 0, 107, 368],
  ['tree-2', 2, 391, 108, 313],
  ['tree-3', 4, 720, 88, 208],
  ['tree-4', 6, 944, 88, 144],
  ['tree-5', 5, 1092, 70, 108]
];

// The tree block repeats once more this far to the right, in a second shape variant.
const TREE_HALF_OFFSET = 672;

// [name, x, y, width, height] - the rocks are packed without a grid, so these
// are measured too. Only the mossy ones, and only sizes the player can clear.
const ROCK_FRAMES = [
  ['rock-small', 128, 89, 16, 23],
  ['rock-mid', 193, 97, 30, 31],
  ['rock-wide', 212, 132, 59, 28]
];

// All tree sheets share the same layout, so they get the same frames.
export const TREE_TEXTURES = ['tree-yellow', 'tree-dark'];

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

  // Loads sky, trees, tiles and clouds.
  loadEnvironment() {
    this.load.image('background', 'assets/environment/background/Background.png');
    this.load.image('tree-yellow', 'assets/environment/trees/Yellow-Tree.png');
    this.load.image('tree-dark', 'assets/environment/trees/Dark-Tree.png');
    this.load.spritesheet('tiles', 'assets/environment/tiles/Tiles.png', { frameWidth: TILE_SIZE, frameHeight: TILE_SIZE });
    this.load.image('trees-bg', 'assets/environment/trees/Trees-Background.png');
    this.load.image('rocks', 'assets/environment/Props-Rocks.png');
    this.load.image('clouds', 'assets/environment/clouds/Clouds.png');
    this.load.image('clouds-flat', 'assets/environment/clouds/Clouds-Flat.png');
  }

  // Loads the player sheets - frame sizes differ per sheet, the attack is wider.
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

  // Registers the player animations - repeat -1 loops, 0 plays once.
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

  // Names the regions on sheets that do not sit on a uniform grid.
  createCustomFrames() {
    const bg = this.textures.get('trees-bg');
    bg.add('trees-dark-a', 0, 0, 0, 96, 256);
    bg.add('trees-dark-b', 0, 112, 0, 96, 256);
    bg.add('trees-dark-c', 0, 224, 0, 127, 256);
    bg.add('trees-light-a', 0, 352, 0, 96, 256);
    bg.add('trees-light-b', 0, 464, 0, 96, 256);
    bg.add('trees-light-c', 0, 576, 0, 127, 256);
    bg.add('mtn-dark', 0, 704, 0, 95, 256);
    bg.add('mtn-light', 0, 801, 0, 95, 256);

    ['clouds', 'clouds-flat'].forEach(key => {
      const texture = this.textures.get(key);
      CLOUD_FRAMES.forEach(([name, x, y, w, h]) => texture.add(name, 0, x, y, w, h));
    });

    TREE_TEXTURES.forEach(key => {
      const texture = this.textures.get(key);
      TREE_FRAMES.forEach(([name, x, y, w, h]) => {
        texture.add(`${name}a`, 0, x, y, w, h);
        texture.add(`${name}b`, 0, x + TREE_HALF_OFFSET, y, w, h);
      });
    });

    const rocks = this.textures.get('rocks');
    ROCK_FRAMES.forEach(([name, x, y, w, h]) => rocks.add(name, 0, x, y, w, h));

    this.textures.get('tiles').add('bush', 0, 280, 0, 120, 48);
  }
}
