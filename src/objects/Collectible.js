// ============================================================
// COLLECTIBLE
// Item the player can pick up. Floats in place, no gravity.
// Not placed in the level yet.
// ============================================================

import Phaser from 'phaser';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture = 'coin') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setAllowGravity(false);
  }

  // Removes the item once the player touches it.
  collect() {
    this.destroy();
  }
}
