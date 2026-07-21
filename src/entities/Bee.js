// ============================================================
// BEE
// Flying enemy. Ignores gravity so it can hold its altitude.
// Not placed in the level yet.
// ============================================================

import Enemy from './Enemy.js';

export default class Bee extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'bee-fly');
    this.body.setAllowGravity(false);
  }
}
