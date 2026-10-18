import Card from "./Card";

function About() {
  const items = [
    [
      "Hinata x Battamiz Aesthetic",
      "Sweet look with lethal Byakugan precision. Midnight red and electric blue dual-tone interfaces engineered with baddie energy.",
      ["Theme", "Midnight", "Battamiz"],
    ],
    [
      "Frontend & 3D Engineering",
      "Blazing React web applications with 3D perspective touches, neon cyber glow, and 60fps animations.",
      ["React", "Vite", "3D"],
    ],
    [
      "Discord Bot Architect",
      "Engineered automated bot suites for massive servers like Baddie Cafe India: anti-nuke, giveaways, music & voice temp channels.",
      ["discord.js", "Node.js", "Baddie Cafe"],
    ],
    [
      "Twin Lion API & Backend",
      "FastAPI services, asynchronous pipelines, and classification backends that run seamlessly 24/7.",
      ["FastAPI", "Python", "APIs"],
    ],
  ];

  return (
    <>
      <h2>About me · Hinata x BattamizDill</h2>
      <p style={{ color: "var(--mute)", marginBottom: 24, fontSize: 15 }}>
        Sweet face, sharp mind, and unapologetic baddie energy. Crafting midnight
        web apps and community bots with Hinata Hyuga chakra.
      </p>
      <div className="tl">
        {items.map(([title, description, tags]) => (
          <Card key={title} t={title} d={description} tags={tags} />
        ))}
      </div>
    </>
  );
}

export default About;
