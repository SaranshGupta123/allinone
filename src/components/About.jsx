import Card from "./Card";

function About() {
  const items = [
    ["Frontend", "React interfaces with 3D touches that stay light and fast."],
    ["Bots", "Discord bots in Node.js and discord.js v14 for an active community."],
    ["Backend", "FastAPI services for classification and data pipelines."],
  ];

  return (
    <>
      <h2>About me</h2>
      <div className="tl">
        {items.map(([title, description]) => (
          <Card key={title} t={title} d={description} tags={["Skill"]} />
        ))}
      </div>
    </>
  );
}

export default About;
