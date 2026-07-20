import Phaser from 'phaser';
import { SCENES } from '../utils/constants.js';
import Player from '../entities/Player.js';
import Snail from '../entities/Snail.js';
import Boar from '../entities/Boar.js';
import Bee from '../entities/Bee.js';
import Collectible from '../objects/Collectible.js';
import Platform from '../objects/Platform.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  create() {
    this.scene.launch(SCENES.HUD);
  }

  update(time, delta) {
  }
}
