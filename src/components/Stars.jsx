import { useEffect, useRef } from "react";

function Stars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width;
    let height;
    const mouse = { x: 0, y: 0 };
    let animationFrame;
    let stars = [];
    let shooting = null;

    const size = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = Array.from(
        { length: Math.min(180, Math.floor((width * height) / 9000)) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.9 + 0.1,
          p: Math.random() * 6,
          red: Math.random() < 0.18,
        }),
      );
    };

    const move = (event) => {
      mouse.x = event.clientX / width - 0.5;
      mouse.y = event.clientY / height - 0.5;
    };

    const tick = (time) => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const px = star.x + mouse.x * 40 * star.z;
        const py = star.y + mouse.y * 40 * star.z;
        const alpha =
          0.35 +
          0.65 * Math.abs(Math.sin((time / 900) * star.z + star.p));

        context.fillStyle = star.red
          ? `rgba(255,70,95,${alpha})`
          : `rgba(255,235,240,${alpha * 0.8})`;
        context.shadowColor = star.red ? "#ff2d4b" : "#fff";
        context.shadowBlur = star.red ? 8 : 3;
        context.beginPath();
        context.arc(px, py, star.z * 1.7, 0, Math.PI * 2);
        context.fill();

        if (!reduce) {
          star.y += star.z * 0.05;
          if (star.y > height) star.y = 0;
        }
      }

      if (!reduce && !shooting && Math.random() < 0.004) {
        shooting = {
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          l: 0,
        };
      }

      if (shooting) {
        context.shadowBlur = 0;
        const gradient = context.createLinearGradient(
          shooting.x,
          shooting.y,
          shooting.x - 90,
          shooting.y - 45,
        );
        gradient.addColorStop(0, "rgba(255,90,110,.95)");
        gradient.addColorStop(1, "transparent");
        context.strokeStyle = gradient;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(shooting.x, shooting.y);
        context.lineTo(shooting.x - 90, shooting.y - 45);
        context.stroke();

        shooting.x += 14;
        shooting.y += 7;
        if (++shooting.l > 70) shooting = null;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    size();
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", move);
    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas id="stars" ref={canvasRef} aria-hidden="true" />;
}

export default Stars;
