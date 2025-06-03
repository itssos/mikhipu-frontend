import React, { useEffect, useRef, useState } from "react";

export default function BookPopper() {
  const [visible, setVisible] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [popAnim, setPopAnim] = useState(false);
  const [explodeAnim, setExplodeAnim] = useState(false);

  // Estado para posición y velocidad
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ dx: 1, dy: 1 });
  const rafRef = useRef();

  const timerRef = useRef(null);
  const lastPopTimeRef = useRef(Date.now());

  // Audio
  const audioRef = useRef(null);

  // Timer para mostrar el GIF cada 5 minutos
  useEffect(() => {
    if (visible) return;
    const msSinceLastPop = Date.now() - lastPopTimeRef.current;
    const msToNextPop = Math.max(0, 5 * 60 * 50 - msSinceLastPop);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      setClicks(0);
      setPopAnim(false);
      setExplodeAnim(false);

      // Posición y dirección aleatoria inicial
      setPosition({
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
      });
      setVelocity({
        dx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5),
        dy: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5),
      });
    }, msToNextPop);

    return () => clearTimeout(timerRef.current);
  }, [visible]);

  // Movimiento animado
  useEffect(() => {
    if (!visible) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const animate = () => {
      setPosition(prev => {
        let { x, y } = prev;
        let { dx, dy } = velocity;
        const imgW = 100, imgH = 100; // el tamaño de tu img
        let nextX = x + dx;
        let nextY = y + dy;

        // Rebote en bordes
        if (nextX < 0 || nextX > window.innerWidth - imgW) {
          setVelocity(v => ({ ...v, dx: -v.dx }));
          nextX = Math.max(0, Math.min(nextX, window.innerWidth - imgW));
        }
        if (nextY < 0 || nextY > window.innerHeight - imgH) {
          setVelocity(v => ({ ...v, dy: -v.dy }));
          nextY = Math.max(0, Math.min(nextY, window.innerHeight - imgH));
        }
        return { x: nextX, y: nextY };
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [visible, velocity]);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setPopAnim(true);
    if (clicks + 1 >= 5) {
      setExplodeAnim(true);
      setTimeout(() => {
        setVisible(false);
        lastPopTimeRef.current = Date.now();
      }, 400);
    } else {
      setClicks(c => c + 1);
    }
  };

  // Reset animación "pop"
  useEffect(() => {
    if (popAnim) {
      const t = setTimeout(() => setPopAnim(false), 200);
      return () => clearTimeout(t);
    }
  }, [popAnim]);

  return (
    <>
      <audio ref={audioRef} src="/pop.mp3" preload="auto" />
      {visible && (
        <div
          className={`book-gif-container ${
            popAnim ? "book-gif-pop" : ""
          } ${explodeAnim ? "book-gif-explode" : ""}`}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: 100,
            height: 100,
            zIndex: 9999,
            cursor: "pointer",
            transition: popAnim ? "transform 0.15s" : undefined,
            willChange: "transform, left, top",
            userSelect: "none"
          }}
          onClick={handleClick}
        >
          <img src="/book.gif" alt="Book" width={100} height={100} draggable={false} style={{pointerEvents: "none"}}/>
        </div>
      )}
    </>
  );
}
