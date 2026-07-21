// ============================================================
// ENEMY (base class)
// Shared behaviour for all enemies: health, damage, death.
// Snail, Boar and Bee extend this.
// ============================================================

import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  // ---------- SETUP ----------

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.health = 1;
  }

  // ---------- DAMAGE & DEATH ----------

  takeDamage(amount = 1) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.destroy();
  }

  // ---------- UPDATE LOOP ----------

  // Subclasses override this with their own movement.
  update(time, delta) {
  }
}
