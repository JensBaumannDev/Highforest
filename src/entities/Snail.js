// ============================================================
// SNAIL
// Slow ground enemy. One hit kills it.
// Not placed in the level yet.
// ============================================================

import Enemy from './Enemy.js';

export default class Snail extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snail-walk');
  }
}
