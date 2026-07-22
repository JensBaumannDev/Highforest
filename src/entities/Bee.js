// ============================================================
// BEE
// Flying enemy. Ignores gravity and circles the hive it belongs to.
// ============================================================

import Enemy from './Enemy.js';

// Half the width and height of the loop it flies.
const ORBIT_X = 46;
const ORBIT_Y = 20;

// Radians per millisecond.
const ORBIT_SPEED = 0.0016;

export default class Bee extends Enemy {

  constructor(scene, x, y, phase = 0) {
    super(scene, x, y, 'bee-fly');
    this.body.setAllowGravity(false);
    this.play('bee-fly');

    this.homeX = x;
    this.homeY = y;
    this.phase = phase;
  }

  // Flies a flat figure of eight around its home spot.
  update(time) {
    const angle = time * ORBIT_SPEED + this.phase;

    this.x = this.homeX + Math.cos(angle) * ORBIT_X;
    this.y = this.homeY + Math.sin(angle * 2) * ORBIT_Y;

    // The sheet faces left, so flip while moving the other way.
    this.setFlipX(Math.sin(angle) < 0);
  }
}
