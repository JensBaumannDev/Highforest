import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_JUMP } from '../utils/constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(2);
    this.setCollideWorldBounds(true);
    this.play('idle');
    this.setSize(20, 48);
    this.setOffset(22, 16);

    this.isAttacking = false;

    // Attack animation finished → clear the flag
    this.on('animationcomplete-attack', () => {
      this.isAttacking = false;
    });
  }

  update(cursors, attackKey) {
    const onGround = this.body.blocked.down || this.body.touching.down;

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(cursors.up) ||
      Phaser.Input.Keyboard.JustDown(cursors.space);

    // Start an attack (only while grounded and not already attacking)
    if (attackKey && Phaser.Input.Keyboard.JustDown(attackKey) && onGround && !this.isAttacking) {
      this.isAttacking = true;
      this.setVelocityX(0);
      this.play('attack', true);
      this.setOffset(22, 16);
      return; // No further logic this frame
    }

    // While attacking: no movement, let the animation play out
    if (this.isAttacking) {
      this.setVelocityX(0);
      return;
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

    // Animation
    if (!onGround) {
      this.play('jump', true);
      this.setOffset(22, 8);
    } else if (cursors.left.isDown || cursors.right.isDown) {
      this.play('run', true);
      this.setOffset(22, 16);
    } else {
      this.play('idle', true);
      this.setOffset(22, 16);
    }
  }
}
