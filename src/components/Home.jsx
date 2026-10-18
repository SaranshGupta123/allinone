import { ME, PROJECTS, RESUME } from "../data";
import Card from "./Card";

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>
            Hi, I'm {ME.name}
            <span>building under midnight skies.</span>
          </h1>
          <p>{ME.bio}</p>
          <a className="btn" href="#projects">
            View projects
          </a>
          <a className="btn ghost" href="#contact">
            Get in touch
          </a>
        </div>

        <div className="scene" aria-hidden="true">
          <div className="cube">
            {["React", "Node", "Bots", "UI", "3D", "Web"].map((face) => (
              <i key={face}>{face}</i>
            ))}
          </div>
        </div>
      </section>

      <div className="stats">
        {[
          ["20+", "Projects"],
          ["2+", "Bots live"],
          ["3", "Stacks"],
          ["24/7", "Online"],
        ].map(([number, label]) => (
          <div className="card" key={label}>
            <h3>{number}</h3>
            <p>{label}</p>
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
    </>
  );
}

export default Home;
