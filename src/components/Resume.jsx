import { RESUME, SKILLS } from "../data";
import Card from "./Card";

function Resume() {
  return (
    <>
      <h2>Resume</h2>
      <div className="grid">
        {RESUME.map((item) => (
          <Card key={item.t} {...item} />
        ))}
      </div>

      <h2>Skills</h2>
      <div className="tags">
        {SKILLS.map((skill) => (
          <b key={skill} style={{ fontSize: 15, padding: "6px 16px" }}>
            {skill}
          </b>
        ))}
      </div>
    </>
  );
}

export default Resume;
