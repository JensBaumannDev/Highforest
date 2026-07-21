// ============================================================
// GAME OVER SCENE
// Shown after the player dies. A click returns to the menu.
// Nothing triggers this scene yet.
// ============================================================

import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  // ---------- LIFECYCLE ----------

  create() {
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
