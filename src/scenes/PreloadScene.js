import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload() {
  }

  create() {
    this.scene.start(SCENES.MENU);
  }
}
