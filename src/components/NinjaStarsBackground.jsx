// src/components/NinjaStarsBackground.jsx
import React, { useRef, useEffect } from 'react';

// Number of stars, feel free to tweak
const NUM_STARS = 30;

// Utility to pick a random number between min and max
const rand = (min, max) => Math.random() * (max - min) + min;

// Draws a simple 4-pointed “ninja star” (a diamond) at (x,y)
function drawStar(ctx, x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  const s = size / 2;
  // diamond shape
  ctx.moveTo(-s, 0);
  ctx.lineTo(0, -s);
  ctx.lineTo(s, 0);
  ctx.lineTo(0, s);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,85,255,0.4)';  // translucent primary color
  ctx.fill();
  ctx.restore();
}

export default function NinjaStarsBackground() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Initialize star “particles”
    const stars = Array.from({ length: NUM_STARS }).map(() => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      size: rand(10, 30),
    }));

    let anim;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;
        star.rot += star.vr;
        // bounce off edges
        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;
        drawStar(ctx, star.x, star.y, star.size, star.rot);
      });
      anim = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,           // behind everything
        pointerEvents: 'none' // clicks pass through
      }}
    />
  );
}
