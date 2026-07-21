// ============================================================
// ENTRY POINT
// Boots the Phaser game. Nothing else belongs in here.
// ============================================================

import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';

// ---------- GAME INSTANCE ----------

const game = new Phaser.Game(gameConfig);

// ---------- DEV: HOT RELOAD ----------

// Phaser scenes do not survive a hot swap, so force a full reload
// instead. Stripped from the production build.
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => window.location.reload());
}

export default game;
