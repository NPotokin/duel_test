import React, { useEffect, useRef, useCallback, useState } from 'react';
import './game.css';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuVisible, setScore } from '../../store/playerSlice';
import { RootState } from '../../store/store';

type Ball = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  direction: number;
};

type Bullet = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  vx: number;
  vy: number;
  firedBy: 'ball1' | 'ball2';
  color: string;
};

const BallGame: React.FC = () => {
  const dispatch = useDispatch();

  const scoreBall1 = useSelector((state: RootState) => state.player.ball1.score);
  const scoreBall2 = useSelector((state: RootState) => state.player.ball2.score);

  const speedBall1 = useSelector((state: RootState) => state.player.ball1.speed);
  const speedBall2 = useSelector((state: RootState) => state.player.ball2.speed);
  const fireSpeedBall1 = useSelector((state: RootState) => state.player.ball1.fireSpeed);
  const fireSpeedBall2 = useSelector((state: RootState) => state.player.ball2.fireSpeed);
  const fireColorBall1 = useSelector((state: RootState) => state.player.ball1.fireColor);
  const fireColorBall2 = useSelector((state: RootState) => state.player.ball2.fireColor);
  const menuVisibleBall1 = useSelector((state: RootState) => state.player.ball1.menuVisible);
  const menuVisibleBall2 = useSelector((state: RootState) => state.player.ball2.menuVisible);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const ball1 = useRef<Ball>({ x: 50, y: 50, radius: 20, speed: speedBall1, direction: 1 });
  const ball2 = useRef<Ball>({ x: 350, y: 350, radius: 20, speed: speedBall2, direction: -1 });

  const [bullets, setBullets] = useState<Bullet[]>([]);

  const shootBullet = useCallback(
    (ball: React.MutableRefObject<Ball>, enemyBall: React.MutableRefObject<Ball>, firedBy: 'ball1' | 'ball2') => {
      const bulletSpeed = ball.current.speed;
      const bulletRadius = 5;
      const bulletColor = firedBy === 'ball1' ? fireColorBall1 : fireColorBall2;

      const angle = Math.atan2(enemyBall.current.y - ball.current.y, enemyBall.current.x - ball.current.x);
      const vx = bulletSpeed * Math.cos(angle);
      const vy = bulletSpeed * Math.sin(angle);

      setBullets((prevBullets) => [
        ...prevBullets,
        {
          x: ball.current.x,
          y: ball.current.y,
          radius: bulletRadius,
          speed: bulletSpeed,
          vx,
          vy,
          firedBy,
          color: bulletColor, 
        },
      ]);
    },
    [fireColorBall1, fireColorBall2]
  );

  const updateBall = useCallback((ball: React.MutableRefObject<Ball>, deltaTime: number) => {
    ball.current.y += ball.current.speed * ball.current.direction * deltaTime;

    if (ball.current.y - ball.current.radius < 0 || ball.current.y + ball.current.radius > 400) {
      ball.current.direction *= -1;
    }

    const dx = ball.current.x - mousePosRef.current.x;
    const dy = ball.current.y - mousePosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ball.current.radius) {
      ball.current.direction *= -1;
    }
  }, []);

  const updateBullets = useCallback(
    (deltaTime: number) => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + bullet.vx * deltaTime,
            y: bullet.y + bullet.vy * deltaTime,
          }))
          .filter((bullet) => {
            if (
              bullet.x - bullet.radius < 0 ||
              bullet.x + bullet.radius > 400 ||
              bullet.y - bullet.radius < 0 ||
              bullet.y + bullet.radius > 400
            ) {
              return false;
            }

            if (bullet.firedBy === 'ball1') {
              const dx = bullet.x - ball2.current.x;
              const dy = bullet.y - ball2.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < ball2.current.radius + bullet.radius) {
                dispatch(setScore({ player: 'ball1', score: scoreBall1 + 1 }));
                return false;
              }
            } else if (bullet.firedBy === 'ball2') {
              const dx = bullet.x - ball1.current.x;
              const dy = bullet.y - ball1.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < ball1.current.radius + bullet.radius) {
                dispatch(setScore({ player: 'ball2', score: scoreBall2 + 1 }));
                return false;
              }
            }

            return true;
          })
      );
    },
    [dispatch, scoreBall1, scoreBall2]
  );

  const drawBall = useCallback((ctx: CanvasRenderingContext2D, ball: React.MutableRefObject<Ball>) => {
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }, []);

  const drawBullet = useCallback((ctx: CanvasRenderingContext2D, bullet: Bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color; 
    ctx.fill();
    ctx.closePath();
  }, []);

  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, []);

  const gameLoop = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (previousTimeRef.current != null) {
        const deltaTime = (time - previousTimeRef.current) / 1000;

        updateBall(ball1, deltaTime);
        updateBall(ball2, deltaTime);
        updateBullets(deltaTime);

        clearCanvas(ctx);
        drawBall(ctx, ball1);
        drawBall(ctx, ball2);

        bullets.forEach((bullet) => drawBullet(ctx, bullet));
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [bullets, clearCanvas, drawBall, drawBullet, updateBall, updateBullets]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const shootIntervalBall1 = setInterval(() => {
      shootBullet(ball1, ball2, 'ball1');
    }, 1000 / fireSpeedBall1); 

    const shootIntervalBall2 = setInterval(() => {
      shootBullet(ball2, ball1, 'ball2');
    }, 1000 / fireSpeedBall2); 

    return () => {
      clearInterval(shootIntervalBall1);
      clearInterval(shootIntervalBall2);
    };
  }, [shootBullet, fireSpeedBall1, fireSpeedBall2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx1 = x - ball1.current.x;
      const dy1 = y - ball1.current.y;
      if (Math.sqrt(dx1 * dx1 + dy1 * dy1) < ball1.current.radius) {
        dispatch(setMenuVisible({ player: 'ball1', menuVisible: !menuVisibleBall1 }));
      }

      const dx2 = x - ball2.current.x;
      const dy2 = y - ball2.current.y;
      if (Math.sqrt(dx2 * dx2 + dy2 * dy2) < ball2.current.radius) {
        dispatch(setMenuVisible({ player: 'ball2', menuVisible: !menuVisibleBall2 }));
      }
    },
    [dispatch, menuVisibleBall1, menuVisibleBall2]
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '1px solid black' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </>
  );
};

export default BallGame;
