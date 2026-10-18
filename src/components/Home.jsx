import { ME, PROJECTS, RESUME } from "../data";
import Card from "./Card";
import Collaborate from "./Collaborate";

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="hero-baddie-badge">
            <span className="badge-flame">🔥</span>
            <span>Hinata x BattamizDill · Midnight Red &amp; Blue</span>
            <span className="badge-spark">⚡</span>
          </div>

          <h1>
            Hi, I'm {ME.name}
            <span className="hero-gradient-text">
              Byakugan precision under midnight skies.
            </span>
          </h1>

          <p>{ME.bio}</p>

          <div className="hero-baddie-tags">
            <span className="b-tag red">💋 Battamiz Vibe</span>
            <span className="b-tag purple">🌸 Hinata Hyuga Chakra</span>
            <span className="b-tag blue">⚡ Midnight Red &amp; Blue</span>
            <span className="b-tag neon">🐾 Twin Lion Fists</span>
          </div>

          <div className="hero-cta-group">
            <a className="btn btn-dual" href="#projects">
              View projects
            </a>
            <a className="btn ghost btn-cyan" href="#collaborate">
              Suggest &amp; Work
            </a>
            <a className="btn ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <div className="scene" aria-hidden="true">
          <div className="cube">
            {["Hinata 🌸", "Battamiz 💋", "Byakugan 👁️", "Midnight ⚡", "React ⚛️", "Bots 🤖"].map((face) => (
              <i key={face}>{face}</i>
            ))}
          </div>
        </div>
      </section>

      <div className="stats">
        {[
          ["20+", "Projects", "🔥 High-speed code"],
          ["2+", "Bots live", "🤖 Community servers"],
          ["Dual", "Red & Blue", "⚡ Hinata chakra"],
          ["24/7", "Battamiz", "💋 Baddie energy"],
        ].map(([number, label, sub]) => (
          <div className="card stat-card" key={label}>
            <h3>{number}</h3>
            <p className="stat-title">{label}</p>
            <small className="stat-sub">{sub}</small>
          </div>
        ))}
      </div>

      <h2>Featured</h2>
      <div className="grid">
        {PROJECTS.slice(0, 3).map((project) => (
          <Card key={project.t} {...project} />
        ))}
      </div>

      <h2>Resume &amp; more</h2>
      <div className="grid">
        {RESUME.slice(0, 2).map((item) => (
          <Card key={item.t} {...item} />
        ))}
      </div>

      <div style={{ marginTop: 52 }}>
        <Collaborate isHomeSection={true} />
      </div>
    </>
  );
}

export default Home;
