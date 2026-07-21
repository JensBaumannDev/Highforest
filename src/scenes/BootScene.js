// ============================================================
// BOOT SCENE
// First scene to run. Meant for the few assets the loading
// screen itself needs, then hands over to PreloadScene.
// ============================================================

import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  // ---------- LOADING ----------

  preload() {
  }

  // ---------- LIFECYCLE ----------

  create() {
    this.scene.start(SCENES.PRELOAD);
  }
}
