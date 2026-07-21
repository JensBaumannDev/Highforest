// ============================================================
// MENU SCENE
// Title screen. Currently a click anywhere starts the game —
// no title, no buttons yet.
// ============================================================

import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  // ---------- LIFECYCLE ----------

  create() {
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.GAME);
    });
  }
}
