// ============================================================
// HUD SCENE
// Overlay for health, coins and the like. Runs in parallel with
// GameScene (launched, not started), so it keeps its own camera
// and is not affected by scrolling. Empty so far.
// ============================================================

import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.HUD, active: false });
  }

  // ---------- LIFECYCLE ----------

  create() {
  }
}
