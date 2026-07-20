import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload() {
  }

  create() {
    this.scene.start(SCENES.PRELOAD);
  }
}
