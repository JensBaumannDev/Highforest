// ============================================================
// GAME CONFIG
// Everything Phaser needs at startup: canvas, scaling, physics
// and the scene list.
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from '../utils/constants.js';

// ---------- SCENES ----------

import BootScene from '../scenes/BootScene.js';
import PreloadScene from '../scenes/PreloadScene.js';
import MenuScene from '../scenes/MenuScene.js';
import GameScene from '../scenes/GameScene.js';
import HUDScene from '../scenes/HUDScene.js';
import GameOverScene from '../scenes/GameOverScene.js';

// ---------- CONFIG ----------

export const gameConfig = {
  // Rendering
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#1a1420',
  pixelArt: true,

  // Scaling: FIT keeps the aspect ratio inside #game-container.
  // Centering is left to CSS on purpose — two systems centering the
  // same canvas cancel each other out.
  scale: {
    mode: Phaser.Scale.FIT,
  },

  // Physics: set debug to true to draw hitboxes on screen.
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },

  // Scene order matters: the first entry starts automatically.
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    HUDScene,
    GameOverScene,
  ],
};
