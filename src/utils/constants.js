// ============================================================
// CONSTANTS
// Shared values. Change a number here, not in the game code.
// ============================================================

// ---------- DISPLAY ----------

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 768;

// ---------- WORLD ----------

export const GRAVITY = 1500;
export const TILE_SIZE = 16;
export const TILE_SCALE = 4;

// ---------- PLAYER ----------

export const PLAYER_SPEED = 400;
export const PLAYER_JUMP = 500;

// ---------- SCENE KEYS ----------

export const SCENES = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  HUD: 'HUDScene',
  GAME_OVER: 'GameOverScene',
};
