import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.HUD, active: false });
  }

  create() {
  }
}
