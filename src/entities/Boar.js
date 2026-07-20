import Enemy from './Enemy.js';

export default class Boar extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'boar-idle');
    this.health = 2;
  }
}
