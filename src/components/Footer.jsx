import { useState } from "react";
import {
  FaGithub,
  FaDiscord,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";

import { ME, PAGES, SKILLS } from "../data";
import VisitorCounter from "./VisitorCounter";

const socialIcons = {
  github: FaGithub,
  discord: FaDiscord,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  email: FaEnvelope,
};

function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Saranshgupta14.sg@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer>
      <div className="fgrid">
        <div>
          <h4 style={{ color: "var(--red)", fontSize: 24 }}>{ME.name}</h4>

          <p style={{ color: "var(--mute)" }}>
            {ME.role}. Open for freelance and collabs.
          </p>

          <div className="soc" style={{ marginTop: 16 }}>
            {ME.socials.map(([icon, name, href]) => {
              const Icon = socialIcons[icon];

              return (
                <a
                  key={name}
                  href={href}
                  title={name}
                  aria-label={name}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4>Pages</h4>

          <ul>
            {PAGES.map((page) => (
              <li key={page}>
                <a href={`#${page}`}>{page[0].toUpperCase() + page.slice(1)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Stack</h4>

          <ul>
            {SKILLS.slice(0, 5).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Say hello</h4>

          <div className="footer-email-card">
            <a
              href="mailto:Saranshgupta14.sg@gmail.com"
              className="footer-email-link"
              title="Send email to Saransh (Saranshgupta14.sg@gmail.com)"
            >
              <FaEnvelope className="footer-email-icon" />
              <span>Email me</span>
            </a>
            <button
              type="button"
              className={`footer-email-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopyEmail}
              title="Copy Saranshgupta14.sg@gmail.com"
              aria-label="Copy email address"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          <ul>
            <li>Replies within a day</li>
            <li>India · IST</li>
          </ul>

          <a
            className="btn"
            href="#home"
            style={{ marginTop: 14 }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Back to top
          </a>
        </div>
      </div>

      {/* Visitor Counter */}
      <VisitorCounter />

      <div className="copy">
        <span>
          © {new Date().getFullYear()} {ME.name}. Made with React under red
          stars.
        </span>

        <span>Built light, runs fast.</span>
      </div>
    </footer>
  );
}

export default Footer;
