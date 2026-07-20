import Enemy from './Enemy.js';

export default class Bee extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'bee-fly');
    this.body.setAllowGravity(false);
  }
}
