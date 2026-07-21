// ============================================================
// PLAYER
// The controllable character: movement, jumping, attacking and
// the animation state that goes with it.
// ============================================================

import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_JUMP } from '../utils/constants.js';

// ---------- CONFIG ----------

// Body offsets per animation, because the sheets differ in frame size:
// jump is 64x64, attack is 96x80 (the swing reaches past the body),
// the rest is 64x80.
const BODY_OFFSET = {
  idle: { x: 22, y: 16 },
  run: { x: 22, y: 16 },
  jump: { x: 22, y: 8 },
  attack: { x: 38, y: 16 },
};

const BODY_WIDTH = 20;
const BODY_HEIGHT = 48;

export default class Player extends Phaser.Physics.Arcade.Sprite {

  // ---------- SETUP ----------

  constructor(scene, x, y) {
    super(scene, x, y, 'player-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2);
    this.setCollideWorldBounds(true);
    this.setSize(BODY_WIDTH, BODY_HEIGHT);

    this.isAttacking = false;
    this.playAnim('idle');

    // Attack animation finished → clear the flag
    this.on('animationcomplete-attack', () => {
      this.isAttacking = false;
    });
  }

  // ---------- ANIMATION ----------

  // Plays an animation and moves the body to the offset that belongs to it.
  // Skips the call while that animation is already running, so a looping
  // animation is not restarted every frame. The isPlaying check matters:
  // without it a finished attack would block the next one.
  playAnim(key) {
    if (this.anims.currentAnim?.key === key && this.anims.isPlaying) {
      return;
    }

    const offset = BODY_OFFSET[key];

    this.play(key, true);
    this.setOffset(offset.x, offset.y);
  }

  // ---------- UPDATE LOOP ----------

  update(cursors, attackKey) {
    const onGround = this.body.blocked.down || this.body.touching.down;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(cursors.up) ||
      Phaser.Input.Keyboard.JustDown(cursors.space);

    // Start an attack (at any time, as long as none is running)
    if (attackKey && Phaser.Input.Keyboard.JustDown(attackKey) && !this.isAttacking) {
      this.isAttacking = true;
      this.playAnim('attack');
    }

    // Movement
    if (cursors.left.isDown) {
      this.setVelocityX(-PLAYER_SPEED);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(PLAYER_SPEED);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jump
    if (jumpPressed && onGround) {
      this.setVelocityY(-PLAYER_JUMP);
    }

    // Animation — the attack owns the sprite until it finishes. Everything
    // above has already run, so only the animation choice is skipped.
    if (this.isAttacking) {
      return;
    }

    if (!onGround) {
      this.playAnim('jump');
    } else if (cursors.left.isDown || cursors.right.isDown) {
      this.playAnim('run');
    } else {
      this.playAnim('idle');
    }
  }
}
