import { useEffect, useState } from "react";
import {
  FiSearch,
  FiX,
  FiMenu,
  FiHome,
  FiFolder,
  FiFileText,
  FiUser,
  FiSend,
  FiMail,
} from "react-icons/fi";

import { PAGES } from "./data";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Player from "./components/Player";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Stars from "./components/Stars";
import Mascot from "./components/Mascot";
import battamizLogo from "./assets/battamizdill-logo.png";

function App() {
  const getPage = () => {
    const page = window.location.hash.slice(1);
    return PAGES.includes(page) ? page : "home";
  };

  const [page, setPage] = useState(getPage);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPage());
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const search = (value) => {
    setQuery(value);

    if (value.trim() && page !== "projects") {
      window.location.hash = "projects";
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <>
      <Stars />
      <Player />
      <Mascot />

      <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>
        <a
          className="logo"
          href="#home"
          onClick={() => setMenuOpen(false)}
        >
          <img src={battamizLogo} alt="BattamizDill" />
          <span>BattamizDill</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="links desktop-nav">
          {PAGES.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={item === page ? "on" : ""}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </a>
          ))}
        </div>

        {/* Desktop Search Bar */}
        <label className="search desktop-search">
          <FiSearch className="search-icon" aria-hidden="true" />

          <input
            type="search"
            placeholder="Search projects..."
            value={query}
            onChange={(event) => search(event.target.value)}
            aria-label="Search projects"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </label>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`hamburger-btn ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span className="hamburger-icon-wrapper">
            {menuOpen ? <FiX /> : <FiMenu />}
          </span>
        </button>
      </nav>

      {/* Mobile Hamburger Navigation Drawer Overlay */}
      <div
        id="mobile-navigation"
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMenuOpen(false)}
        />
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-top">
            <div className="mobile-menu-brand">
              <img src={battamizLogo} alt="" className="mobile-menu-logo" />
              <span>BattamizDill</span>
            </div>
            <button
              type="button"
              className="mobile-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {/* Search inside Mobile Menu */}
          <div className="mobile-search-section">
            <label className="search mobile-search">
              <FiSearch className="search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects..."
                value={query}
                onChange={(event) => search(event.target.value)}
                aria-label="Search projects"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <FiX aria-hidden="true" />
                </button>
              )}
            </label>
          </div>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {PAGES.map((item) => {
              const icons = {
                home: FiHome,
                projects: FiFolder,
                resume: FiFileText,
                about: FiUser,
                contact: FiSend,
              };
              const Icon = icons[item] || FiHome;

              return (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`mobile-nav-item ${item === page ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">
                    <Icon />
                  </span>
                  <span className="mobile-nav-title">
                    {item[0].toUpperCase() + item.slice(1)}
                  </span>
                  {item === page && (
                    <span className="mobile-nav-badge">Current</span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Footer: Quick contact */}
          <div className="mobile-menu-bottom">
            <a
              href="mailto:Saranshgupta14.sg@gmail.com"
              className="mobile-drawer-contact"
              onClick={() => setMenuOpen(false)}
            >
              <FiMail />
              <span>Say Hello · Email Me</span>
            </a>
          </div>
        </div>
      </div>

      <main>
        {page === "home" && <Home />}
        {page === "projects" && <Projects q={query} />}
        {page === "resume" && <Resume />}
        {page === "about" && <About />}
        {page === "contact" && <Contact />}
      </main>

      <Footer />
    </>
  );
}

export default App;
