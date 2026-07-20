import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create() {
    this.input.once('pointerdown', () => {
      this.scene.start(SCENES.GAME);
    });
  }
}
