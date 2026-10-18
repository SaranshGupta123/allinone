import { useRef } from "react";

function Card({ t, d, tags, href }) {
  const ref = useRef(null);

  const move = (event) => {
    const bounds = ref.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    ref.current.style.transform =
      `rotateY(${(px - 0.5) * 14}deg) ` +
      `rotateX(${(0.5 - py) * 14}deg) scale(1.03)`;

    ref.current.style.setProperty("--x", `${px * 100}%`);
    ref.current.style.setProperty("--y", `${py * 100}%`);
  };

  const leave = () => {
    ref.current.style.transform = "";
  };

  return (
    <article className="card" ref={ref} onMouseMove={move} onMouseLeave={leave}>
      <div className="glare" />
      <h3>{t}</h3>
      <p>{d}</p>

      <div className="tags">
        {tags.map((tag) => (
          <b key={tag}>{tag}</b>
        ))}
      </div>

      {href && (
        <p style={{ marginTop: 12 }}>
          <a className="btn" href={href}>
            Open
          </a>
        </p>
      )}
    </article>
  );
}

export default Card;
