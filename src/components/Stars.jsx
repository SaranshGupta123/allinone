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
        { length: Math.min(220, Math.floor((width * height) / 8000)) },
        () => {
          const seed = Math.random();
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 0.9 + 0.1,
            p: Math.random() * 6,
            color:
              seed < 0.25
                ? "red"
                : seed < 0.5
                ? "blue"
                : seed < 0.65
                ? "purple"
                : "white",
          };
        },
      );
    };

    const move = (event) => {
      mouse.x = event.clientX / width - 0.5;
      mouse.y = event.clientY / height - 0.5;
    };

    const tick = (time) => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const px = star.x + mouse.x * 45 * star.z;
        const py = star.y + mouse.y * 45 * star.z;
        const alpha =
          0.35 +
          0.65 * Math.abs(Math.sin((time / 900) * star.z + star.p));

        if (star.color === "red") {
          context.fillStyle = `rgba(255, 36, 83, ${alpha})`;
          context.shadowColor = "#ff2453";
          context.shadowBlur = 9;
        } else if (star.color === "blue") {
          context.fillStyle = `rgba(0, 229, 255, ${alpha})`;
          context.shadowColor = "#00d2ff";
          context.shadowBlur = 9;
        } else if (star.color === "purple") {
          context.fillStyle = `rgba(168, 85, 247, ${alpha})`;
          context.shadowColor = "#a855f7";
          context.shadowBlur = 7;
        } else {
          context.fillStyle = `rgba(245, 235, 255, ${alpha * 0.85})`;
          context.shadowColor = "#ffffff";
          context.shadowBlur = 3;
        }

        context.beginPath();
        context.arc(px, py, star.z * 1.7, 0, Math.PI * 2);
        context.fill();

        if (!reduce) {
          star.y += star.z * 0.06;
          if (star.y > height) star.y = 0;
        }
      }

      if (!reduce && !shooting && Math.random() < 0.005) {
        shooting = {
          x: Math.random() * width,
          y: Math.random() * height * 0.45,
          l: 0,
          isBlue: Math.random() < 0.5,
        };
      }

      if (shooting) {
        context.shadowBlur = 8;
        context.shadowColor = shooting.isBlue ? "#00d2ff" : "#ff2453";
        const gradient = context.createLinearGradient(
          shooting.x,
          shooting.y,
          shooting.x - 110,
          shooting.y - 55,
        );
        if (shooting.isBlue) {
          gradient.addColorStop(0, "rgba(0, 229, 255, 0.95)");
          gradient.addColorStop(0.4, "rgba(168, 85, 247, 0.7)");
          gradient.addColorStop(1, "transparent");
        } else {
          gradient.addColorStop(0, "rgba(255, 36, 83, 0.95)");
          gradient.addColorStop(0.4, "rgba(0, 229, 255, 0.65)");
          gradient.addColorStop(1, "transparent");
        }
        context.strokeStyle = gradient;
        context.lineWidth = 2.4;
        context.beginPath();
        context.moveTo(shooting.x, shooting.y);
        context.lineTo(shooting.x - 110, shooting.y - 55);
        context.stroke();

        shooting.x += 16;
        shooting.y += 8;
        if (++shooting.l > 75) shooting = null;
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
