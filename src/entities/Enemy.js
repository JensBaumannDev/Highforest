// ============================================================
// ENEMY (base class)
// Shared behaviour for all enemies: health, damage, death.
// Snail, Boar and Bee extend this.
// ============================================================

import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.health = 1;
  }

  // Subtracts health and kills the enemy once it runs out.
  takeDamage(amount = 1) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  // Removes the enemy from the scene.
  die() {
    this.destroy();
  }

  // Movement, overridden by every subclass.
  update(time, delta) {
  }
}
