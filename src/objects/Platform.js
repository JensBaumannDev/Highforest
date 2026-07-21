// ============================================================
// PLATFORM
// Static, collidable surface. The 'true' in physics.add.existing
// makes the body immovable.
// GameScene currently builds its ground from a staticGroup instead,
// so this is unused for now.
// ============================================================

import Phaser from 'phaser';

export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'tiles') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}
