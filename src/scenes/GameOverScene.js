import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create() {
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
