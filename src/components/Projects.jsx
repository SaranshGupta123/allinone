import { useMemo, useState } from "react";
import { PROJECTS } from "../data";
import Card from "./Card";

function Projects({ q }) {
  const [tag, setTag] = useState("All");
  const tags = ["All", ...new Set(PROJECTS.flatMap((project) => project.tags))];

  const list = useMemo(
    () =>
      PROJECTS.filter(
        (project) =>
          (tag === "All" || project.tags.includes(tag)) &&
          `${project.t}${project.d}${project.tags.join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [q, tag],
  );

  return (
    <>
      <h2>Projects</h2>

      <div className="chips">
        {tags.map((item) => (
          <button
            key={item}
            className={`chip${item === tag ? " on" : ""}`}
            onClick={() => setTag(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="grid">
          {list.map((project) => (
            <Card key={project.t} {...project} />
          ))}
        </div>
      ) : (
        <div className="empty">
          No projects match "{q}". Try another word or clear the filter.
        </div>
      )}
    </>
  );
}

export default Projects;
