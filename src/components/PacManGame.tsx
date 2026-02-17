"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Tiny Pac-Man mini-game (canvas-based) ── */

const TILE = 16;
const COLS = 19;
const ROWS = 19;
const W = COLS * TILE;
const H = ROWS * TILE;
const PAC_SPEED = 2;
const GHOST_SPEED = 1.2;

/* 0 = empty, 1 = wall, 2 = dot, 3 = power pellet */
/* prettier-ignore */
const BASE_MAP: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
  [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface Entity {
  x: number;
  y: number;
  dir: { dx: number; dy: number };
  nextDir?: { dx: number; dy: number };
}

interface Ghost extends Entity {
  color: string;
  scared: boolean;
  scaredTimer: number;
}

const DIRS = {
  right: { dx: 1, dy: 0 },
  left: { dx: -1, dy: 0 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  none: { dx: 0, dy: 0 },
};

function cloneMap() {
  return BASE_MAP.map((row) => [...row]);
}

function canMove(map: number[][], tileX: number, tileY: number): boolean {
  if (tileX < 0 || tileX >= COLS || tileY < 0 || tileY >= ROWS) return true; // wrap
  return map[tileY]?.[tileX] !== 1;
}

function getTile(px: number, py: number) {
  return { tx: Math.floor(px / TILE), ty: Math.floor(py / TILE) };
}

export function PacManGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const stateRef = useRef<{
    pac: Entity;
    ghosts: Ghost[];
    map: number[][];
    score: number;
    dotsLeft: number;
    powerTimer: number;
    gameOver: boolean;
    won: boolean;
    mouthOpen: number;
  } | null>(null);
  const keyRef = useRef<{ dx: number; dy: number }>(DIRS.none);

  const resetGame = useCallback(() => {
    const map = cloneMap();
    let dotsLeft = 0;
    for (const row of map) for (const c of row) if (c === 2 || c === 3) dotsLeft++;

    stateRef.current = {
      pac: { x: 9 * TILE + TILE / 2, y: 15 * TILE + TILE / 2, dir: DIRS.none },
      ghosts: [
        { x: 8 * TILE + TILE / 2, y: 9 * TILE + TILE / 2, dir: DIRS.left, color: "#FF0000", scared: false, scaredTimer: 0 },
        { x: 9 * TILE + TILE / 2, y: 9 * TILE + TILE / 2, dir: DIRS.right, color: "#FFB8FF", scared: false, scaredTimer: 0 },
        { x: 10 * TILE + TILE / 2, y: 9 * TILE + TILE / 2, dir: DIRS.up, color: "#00FFFF", scared: false, scaredTimer: 0 },
      ],
      map,
      score: 0,
      dotsLeft,
      powerTimer: 0,
      gameOver: false,
      won: false,
      mouthOpen: 0,
    };
    setScore(0);
    setGameOver(false);
    setWon(false);
    keyRef.current = DIRS.none;
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          keyRef.current = DIRS.up;
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
          keyRef.current = DIRS.down;
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
          keyRef.current = DIRS.left;
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
          keyRef.current = DIRS.right;
          e.preventDefault();
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    function moveEntity(e: Entity, speed: number, map: number[][]) {
      const { tx, ty } = getTile(e.x, e.y);
      const centerX = tx * TILE + TILE / 2;
      const centerY = ty * TILE + TILE / 2;
      const atCenter = Math.abs(e.x - centerX) < speed && Math.abs(e.y - centerY) < speed;

      if (atCenter && e.nextDir) {
        const ntx = tx + e.nextDir.dx;
        const nty = ty + e.nextDir.dy;
        if (canMove(map, ntx, nty)) {
          e.dir = e.nextDir;
          e.nextDir = undefined;
        }
      }

      if (atCenter) {
        const ntx = tx + e.dir.dx;
        const nty = ty + e.dir.dy;
        if (!canMove(map, ntx, nty)) {
          e.x = centerX;
          e.y = centerY;
          return;
        }
      }

      e.x += e.dir.dx * speed;
      e.y += e.dir.dy * speed;

      /* Wrap around */
      if (e.x < 0) e.x = W;
      if (e.x > W) e.x = 0;
      if (e.y < 0) e.y = H;
      if (e.y > H) e.y = 0;
    }

    function ghostAI(g: Ghost, pac: Entity, map: number[][]) {
      const { tx, ty } = getTile(g.x, g.y);
      const centerX = tx * TILE + TILE / 2;
      const centerY = ty * TILE + TILE / 2;
      if (Math.abs(g.x - centerX) > GHOST_SPEED || Math.abs(g.y - centerY) > GHOST_SPEED) return;

      const possible: { dx: number; dy: number }[] = [];
      for (const d of [DIRS.up, DIRS.down, DIRS.left, DIRS.right]) {
        if (d.dx === -g.dir.dx && d.dy === -g.dir.dy) continue; // no reverse
        if (canMove(map, tx + d.dx, ty + d.dy)) possible.push(d);
      }
      if (possible.length === 0) {
        g.dir = { dx: -g.dir.dx, dy: -g.dir.dy };
        return;
      }

      if (g.scared) {
        g.dir = possible[Math.floor(Math.random() * possible.length)];
        return;
      }

      const ptx = Math.floor(pac.x / TILE);
      const pty = Math.floor(pac.y / TILE);
      let best = possible[0];
      let bestDist = Infinity;
      for (const d of possible) {
        const nx = tx + d.dx;
        const ny = ty + d.dy;
        const dist = (nx - ptx) ** 2 + (ny - pty) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = d;
        }
      }
      g.dir = best;
    }

    function tick() {
      const s = stateRef.current;
      if (!s || s.gameOver || s.won) return;

      /* Set desired direction */
      const kd = keyRef.current;
      if (kd.dx !== 0 || kd.dy !== 0) {
        s.pac.nextDir = kd;
        const { tx, ty } = getTile(s.pac.x, s.pac.y);
        if (canMove(s.map, tx + kd.dx, ty + kd.dy)) {
          if (s.pac.dir.dx === 0 && s.pac.dir.dy === 0) {
            s.pac.dir = kd;
          }
        }
      }

      moveEntity(s.pac, PAC_SPEED, s.map);

      /* Collect dots */
      const { tx, ty } = getTile(s.pac.x, s.pac.y);
      if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
        const cell = s.map[ty][tx];
        if (cell === 2) {
          s.map[ty][tx] = 0;
          s.score += 10;
          s.dotsLeft--;
        } else if (cell === 3) {
          s.map[ty][tx] = 0;
          s.score += 50;
          s.dotsLeft--;
          s.powerTimer = 300; /* ~5 seconds at 60fps */
          for (const g of s.ghosts) {
            g.scared = true;
            g.scaredTimer = 300;
          }
        }
        setScore(s.score);
      }

      if (s.dotsLeft <= 0) {
        s.won = true;
        setWon(true);
        return;
      }

      /* Power timer */
      if (s.powerTimer > 0) {
        s.powerTimer--;
        if (s.powerTimer <= 0) {
          for (const g of s.ghosts) {
            g.scared = false;
            g.scaredTimer = 0;
          }
        }
      }

      /* Ghosts */
      for (const g of s.ghosts) {
        ghostAI(g, s.pac, s.map);
        moveEntity(g, g.scared ? GHOST_SPEED * 0.6 : GHOST_SPEED, s.map);
        if (g.scaredTimer > 0) g.scaredTimer--;
        if (g.scaredTimer <= 0) g.scared = false;

        /* Collision */
        const dist = Math.sqrt((g.x - s.pac.x) ** 2 + (g.y - s.pac.y) ** 2);
        if (dist < TILE * 0.7) {
          if (g.scared) {
            g.x = 9 * TILE + TILE / 2;
            g.y = 9 * TILE + TILE / 2;
            g.scared = false;
            g.scaredTimer = 0;
            s.score += 200;
            setScore(s.score);
          } else {
            s.gameOver = true;
            setGameOver(true);
          }
        }
      }

      s.mouthOpen = (s.mouthOpen + 1) % 12;
    }

    function draw() {
      if (!ctx) return;
      const s = stateRef.current;
      if (!s) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      /* Walls */
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = s.map[y][x];
          if (cell === 1) {
            ctx.fillStyle = "#2121DE";
            ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
          } else if (cell === 2) {
            ctx.fillStyle = "#FFB8AE";
            ctx.beginPath();
            ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            ctx.fillStyle = "#FFB8AE";
            ctx.beginPath();
            ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* Pac-Man */
      const mouthAngle = s.mouthOpen < 6 ? 0.25 : 0.02;
      let angle = 0;
      if (s.pac.dir.dx === 1) angle = 0;
      else if (s.pac.dir.dx === -1) angle = Math.PI;
      else if (s.pac.dir.dy === -1) angle = -Math.PI / 2;
      else if (s.pac.dir.dy === 1) angle = Math.PI / 2;

      ctx.fillStyle = "#FFFF00";
      ctx.beginPath();
      ctx.arc(
        s.pac.x,
        s.pac.y,
        TILE / 2 - 1,
        angle + mouthAngle * Math.PI,
        angle - mouthAngle * Math.PI + Math.PI * 2
      );
      ctx.lineTo(s.pac.x, s.pac.y);
      ctx.closePath();
      ctx.fill();

      /* Ghosts */
      for (const g of s.ghosts) {
        ctx.fillStyle = g.scared ? "#2121DE" : g.color;
        const gx = g.x - TILE / 2 + 1;
        const gy = g.y - TILE / 2 + 1;
        const gw = TILE - 2;
        const gh = TILE - 2;

        /* Ghost body */
        ctx.beginPath();
        ctx.arc(g.x, gy + gw / 2, gw / 2, Math.PI, 0);
        ctx.lineTo(gx + gw, gy + gh);
        /* Wavy bottom */
        const segs = 3;
        const segW = gw / segs;
        for (let i = segs; i > 0; i--) {
          const sx = gx + i * segW;
          const prevSx = gx + (i - 1) * segW;
          ctx.quadraticCurveTo(sx - segW / 2, gy + gh - 4, prevSx, gy + gh);
        }
        ctx.closePath();
        ctx.fill();

        /* Eyes */
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(g.x - 3, g.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(g.x + 3, g.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = g.scared ? "#FFFFFF" : "#2121DE";
        ctx.beginPath();
        ctx.arc(g.x - 2, g.y - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(g.x + 4, g.y - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Game over / won overlay */
      if (s.gameOver || s.won) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = s.won ? "#FFFF00" : "#FF0000";
        ctx.font = "bold 14px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText(s.won ? "YOU WIN!" : "GAME OVER", W / 2, H / 2 - 10);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillText("CLICK TO RESTART", W / 2, H / 2 + 16);
      }
    }

    function loop() {
      tick();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gameOver, won]);

  const handleCanvasClick = () => {
    if (gameOver || won) {
      resetGame();
    }
  };

  /* Touch support */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="maze-border relative inline-block overflow-hidden">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block"
          style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }}
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.current.x;
            const dy = t.clientY - touchStart.current.y;
            if (Math.abs(dx) > Math.abs(dy)) {
              keyRef.current = dx > 0 ? DIRS.right : DIRS.left;
            } else {
              keyRef.current = dy > 0 ? DIRS.down : DIRS.up;
            }
            touchStart.current = null;
          }}
        />
      </div>
      <p className="font-pixel text-xs text-pac-yellow">
        SCORE: {score.toString().padStart(6, "0")}
      </p>
      <p className="text-center text-xs text-white/50">
        Arrow keys or WASD to move &middot; Swipe on mobile
      </p>
    </div>
  );
}
