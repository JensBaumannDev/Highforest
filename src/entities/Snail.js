import Enemy from './Enemy.js';

export default class Snail extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'snail-walk');
  }
}
