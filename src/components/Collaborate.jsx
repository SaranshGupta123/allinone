import { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiFolderPlus,
  FiSend,
  FiMail,
  FiCheck,
  FiCopy,
  FiThumbsUp,
} from "react-icons/fi";
import { FaDiscord, FaLightbulb, FaMagic } from "react-icons/fa";

const TABS = [
  {
    id: "suggestion",
    label: "Suggestions & Ideas",
    shortLabel: "Ideas",
    icon: FaLightbulb,
    badge: "What to change & add",
    color: "#ff8fa3",
  },
  {
    id: "job",
    label: "Job Offer",
    shortLabel: "Job Offer",
    icon: FiBriefcase,
    badge: "Full-time & Contract",
    color: "#60a5fa",
  },
  {
    id: "work",
    label: "Hire for Work / Gig",
    shortLabel: "Give Work",
    icon: FiFolderPlus,
    badge: "Bots, React, APIs",
    color: "#34d399",
  },
  {
    id: "portfolio",
    label: "Share Portfolio & Collab",
    shortLabel: "Collab",
    icon: FaMagic,
    badge: "Team up & review",
    color: "#c084fc",
  },
];

const SUGGESTION_PRESETS = [
  "Add dark / light mode toggle",
  "Discord bot web dashboard with live stats",
  "Interactive CLI / Terminal mode for portfolio",
  "SoundCloud / Spotify custom track playlist",
  "Add a guestbook with live visitor messages",
  "Mini ninja mini-game with leaderboard",
];

const INITIAL_COMMUNITY_IDEAS = [
  {
    id: "idea-1",
    title: "Discord Bot Web Dashboard with Live Roles & Analytics",
    category: "Discord Bot",
    author: "AlexDev",
    votes: 42,
    status: "Planned",
  },
  {
    id: "idea-2",
    title: "Interactive In-Browser CLI Terminal mode for the portfolio",
    category: "Website Feature",
    author: "CyberRonin",
    votes: 35,
    status: "Under Review",
  },
  {
    id: "idea-3",
    title: "Live Spotify / YouTube audio track queue switcher",
    category: "Music Player",
    author: "AriaLover",
    votes: 28,
    status: "Exploring",
  },
  {
    id: "idea-4",
    title: "Mini Ninja Reaction Game with high score leaderboard",
    category: "Interactive",
    author: "Kage7",
    votes: 21,
    status: "In Discussion",
  },
];

function Collaborate({ isHomeSection = false }) {
  const [activeTab, setActiveTab] = useState("suggestion");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Community Wishlist State
  const [communityIdeas, setCommunityIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem("battamizdill_community_ideas");
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_IDEAS;
    } catch {
      return INITIAL_COMMUNITY_IDEAS;
    }
  });

  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("battamizdill_upvoted_ideas");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Suggestion Form State
  const [sugCategory, setSugCategory] = useState("Website Improvement");
  const [sugText, setSugText] = useState("");
  const [sugName, setSugName] = useState("");
  const [sugIsAnon, setSugIsAnon] = useState(false);
  const [sugContact, setSugContact] = useState("");
  const [sugPriority, setSugPriority] = useState("Great idea");
  const [sugPublic, setSugPublic] = useState(true);

  // Job Offer Form State
  const [jobCompany, setJobCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [jobLocation, setJobLocation] = useState("100% Remote");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobContact, setJobContact] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [jobUrgency, setJobUrgency] = useState("Immediate");

  // Work Offer Form State
  const [workTitle, setWorkTitle] = useState("");
  const [workType, setWorkType] = useState("Discord Bot Suite");
  const [workBudget, setWorkBudget] = useState("$100 - $300 / ₹25k");
  const [workTimeline, setWorkTimeline] = useState("2 - 4 weeks");
  const [workScope, setWorkScope] = useState("");
  const [workLink, setWorkLink] = useState("");
  const [workContact, setWorkContact] = useState("");

  // Portfolio / Collab Form State
  const [collabName, setCollabName] = useState("");
  const [collabRole, setCollabRole] = useState("");
  const [collabPortfolioUrl, setCollabPortfolioUrl] = useState("");
  const [collabGoal, setCollabGoal] = useState("Co-build a Web App / SaaS");
  const [collabSkills, setCollabSkills] = useState("");
  const [collabPitch, setCollabPitch] = useState("");
  const [collabContact, setCollabContact] = useState("");

  // Save community ideas to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("battamizdill_community_ideas", JSON.stringify(communityIdeas));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  }, [communityIdeas]);

  // Save upvoted ids
  useEffect(() => {
    try {
      localStorage.setItem("battamizdill_upvoted_ideas", JSON.stringify(upvotedIds));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  }, [upvotedIds]);

  // Handle Idea Upvote
  const handleUpvote = (id) => {
    const hasUpvoted = upvotedIds.includes(id);
    if (hasUpvoted) {
      setUpvotedIds(upvotedIds.filter((item) => item !== id));
      setCommunityIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id ? { ...idea, votes: Math.max(0, idea.votes - 1) } : idea
        )
      );
    } else {
      setUpvotedIds([...upvotedIds, id]);
      setCommunityIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
        )
      );
    }
  };

  // Compile formatted message for email / clipboard
  const compileProposal = () => {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    let subject = "";
    let body = "";

    if (activeTab === "suggestion") {
      const author = sugIsAnon ? "Anonymous Supporter" : sugName || "A Visitor";
      subject = `[Website Suggestion] ${sugCategory} - from ${author}`;
      body = `Hi Saransh,\n\nI have a suggestion on what to change / add to your website or bots:\n\n` +
        `• Category: ${sugCategory}\n` +
        `• From: ${author}\n` +
        `• Contact Info: ${sugContact || "None provided"}\n` +
        `• Priority / Impact: ${sugPriority}\n` +
        `• Show on Public Board: ${sugPublic ? "Yes" : "No"}\n\n` +
        `• Suggestion Details:\n${sugText}\n\n` +
        `Sent on: ${timestamp} IST\nvia BattamizDill Collaborate Hub`;
    } else if (activeTab === "job") {
      subject = `[Job Offer] ${jobRole} at ${jobCompany || "Our Company"}`;
      body = `Hi Saransh,\n\nWe would like to discuss an opportunity / job offer with you:\n\n` +
        `• Company: ${jobCompany}\n` +
        `• Role: ${jobRole}\n` +
        `• Type: ${jobType} (${jobLocation})\n` +
        `• Compensation: ${jobSalary || "To be discussed"}\n` +
        `• Timeline / Urgency: ${jobUrgency}\n` +
        `• Recruiter Contact: ${jobContact}\n` +
        `• Job / Company Link: ${jobLink || "None provided"}\n\n` +
        `• Role Overview & Responsibilities:\n${jobDescription}\n\n` +
        `Sent on: ${timestamp} IST\nvia BattamizDill Collaborate Hub`;
    } else if (activeTab === "work") {
      subject = `[Work Commission / Gig] ${workTitle || workType}`;
      body = `Hi Saransh,\n\nI have a freelance project / work commission for you:\n\n` +
        `• Project: ${workTitle || "Custom Project"}\n` +
        `• Type: ${workType}\n` +
        `• Estimated Budget: ${workBudget}\n` +
        `• Timeline: ${workTimeline}\n` +
        `• Reference / Specs: ${workLink || "None provided"}\n` +
        `• Client Contact: ${workContact}\n\n` +
        `• Project Scope & Deliverables:\n${workScope}\n\n` +
        `Sent on: ${timestamp} IST\nvia BattamizDill Collaborate Hub`;
    } else if (activeTab === "portfolio") {
      subject = `[Portfolio & Collab] Collaboration pitch from ${collabName || "A Creator"}`;
      body = `Hi Saransh,\n\nI'd like to share my portfolio and team up with you:\n\n` +
        `• Name: ${collabName}\n` +
        `• Role / Superpower: ${collabRole}\n` +
        `• Portfolio / GitHub: ${collabPortfolioUrl}\n` +
        `• Collaboration Goal: ${collabGoal}\n` +
        `• My Tech Stack / Skills: ${collabSkills}\n` +
        `• Contact: ${collabContact}\n\n` +
        `• Collaboration Pitch:\n${collabPitch}\n\n` +
        `Sent on: ${timestamp} IST\nvia BattamizDill Collaborate Hub`;
    }

    return { subject, body };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { subject, body } = compileProposal();
    const mailtoUrl = `mailto:Saranshgupta14.sg@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const proposalRecord = {
      type: activeTab,
      subject,
      body,
      createdAt: new Date().toISOString(),
      name:
        activeTab === "suggestion"
          ? sugIsAnon
            ? "Anonymous"
            : sugName || "Visitor"
          : activeTab === "job"
          ? jobCompany || "Recruiter"
          : activeTab === "work"
          ? workTitle || "Client"
          : collabName || "Creator",
    };

    // Save locally
    try {
      const history = JSON.parse(
        localStorage.getItem("battamizdill_user_proposals") || "[]"
      );
      history.unshift(proposalRecord);
      localStorage.setItem(
        "battamizdill_user_proposals",
        JSON.stringify(history.slice(0, 30))
      );
    } catch (err) {
      console.warn("Local storage error:", err);
    }

    // If it's a public suggestion, append to community board
    if (activeTab === "suggestion" && sugPublic && sugText.trim()) {
      const newIdea = {
        id: `idea-${Date.now()}`,
        title: sugText.slice(0, 70) + (sugText.length > 70 ? "..." : ""),
        category: sugCategory,
        author: sugIsAnon ? "Anonymous" : sugName || "Visitor",
        votes: 1,
        status: "New Idea",
      };
      setCommunityIdeas((prev) => [newIdea, ...prev]);
    }

    // Try posting to Netlify function (graceful fallback)
    try {
      await fetch("/.netlify/functions/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          title: subject,
          name: proposalRecord.name,
          contact:
            activeTab === "suggestion"
              ? sugContact
              : activeTab === "job"
              ? jobContact
              : activeTab === "work"
              ? workContact
              : collabContact,
          summary: body.slice(0, 400),
          isPublic: activeTab === "suggestion" ? sugPublic : false,
        }),
      });
    } catch (apiErr) {
      console.info("Offline / simulated endpoint fallback:", apiErr.message);
    }

    setSubmitting(false);
    setSubmittedData({ subject, body, mailtoUrl });
  };

  const handleCopyText = () => {
    if (!submittedData) return;
    navigator.clipboard.writeText(
      `SUBJECT: ${submittedData.subject}\n\n${submittedData.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setSugText("");
    setJobDescription("");
    setWorkScope("");
    setCollabPitch("");
  };

  return (
    <div className={`collab-wrapper ${isHomeSection ? "is-home" : ""}`}>
      {/* Header Banner */}
      <div className="collab-header">
        <div className="collab-header-badge">
          <FaMagic />
          <span>Community, Work &amp; Opportunities</span>
        </div>
        <h2 className="collab-title">
          Suggest Changes, Give Work &amp; Job Offers
        </h2>
        <p className="collab-description">
          Want something added or improved on the site? Offering a developer role,
          freelance work/commissions, or want to share your portfolio to collaborate?
          Pick an option below and connect directly!
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="collab-tabs" role="tablist" aria-label="Collaboration Categories">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`collab-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSubmittedData(null);
              }}
            >
              <span className="collab-tab-icon" style={{ color: tab.color }}>
                <Icon />
              </span>
              <span className="collab-tab-texts">
                <strong className="collab-tab-title">{tab.label}</strong>
                <small className="collab-tab-badge">{tab.badge}</small>
              </span>
              {isActive && <span className="collab-tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Main Submission Card or Success State */}
      <div className="collab-content-card">
        {submittedData ? (
          /* ================= SUCCESS STATE ================= */
          <div className="collab-success-panel">
            <div className="collab-success-glow-icon">
              <FiCheck />
            </div>
            <h3 className="collab-success-title">Proposal Prepared &amp; Logged!</h3>
            <p className="collab-success-subtitle">
              Your submission has been formatted. Choose how you'd like to deliver it
              to Saransh:
            </p>

            {/* Quick Action Buttons */}
            <div className="collab-success-actions">
              <a
                href={submittedData.mailtoUrl}
                className="btn collab-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiMail />
                <span>Open in Email (Gmail / Mail Client)</span>
              </a>

              <button
                type="button"
                className={`btn ghost collab-btn-copy ${copied ? "copied" : ""}`}
                onClick={handleCopyText}
              >
                {copied ? <FiCheck /> : <FiCopy />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Full Text"}</span>
              </button>

              <a
                href="https://discord.gg/rainfall"
                target="_blank"
                rel="noopener noreferrer"
                className="btn ghost collab-btn-discord"
              >
                <FaDiscord />
                <span>Send via Discord Server</span>
              </a>
            </div>

            {/* Formatted Preview Box */}
            <div className="collab-preview-box">
              <div className="collab-preview-header">
                <strong>Subject: {submittedData.subject}</strong>
              </div>
              <pre className="collab-preview-body">{submittedData.body}</pre>
            </div>

            <div className="collab-success-footer">
              <button
                type="button"
                className="collab-reset-btn"
                onClick={handleReset}
              >
                + Submit another proposal or suggestion
              </button>
            </div>
          </div>
        ) : (
          /* ================= FORM INTERFACES ================= */
          <form className="collab-form" onSubmit={handleSubmit}>
            {/* TAB 1: SUGGESTION & FEATURE REQUEST */}
            {activeTab === "suggestion" && (
              <div className="collab-fields-grid">
                <div className="collab-field-banner">
                  <FaLightbulb className="banner-icon" />
                  <div>
                    <h4>Tell me what to change or what to add</h4>
                    <p>
                      Have an idea for the website, a new Discord bot feature,
                      a cooler animation, or feedback? I read every single idea.
                    </p>
                  </div>
                </div>

                {/* Quick Presets Chips */}
                <div className="collab-presets-container">
                  <span className="collab-presets-label">
                    <FaMagic /> Quick Inspiration:
                  </span>
                  <div className="collab-presets-list">
                    {SUGGESTION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="collab-preset-chip"
                        onClick={() => {
                          setSugText((prev) =>
                            prev ? `${prev}\n• ${preset}` : preset
                          );
                        }}
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">Target Area</label>
                    <select
                      className="collab-select"
                      value={sugCategory}
                      onChange={(e) => setSugCategory(e.target.value)}
                    >
                      <option value="Website Improvement">Website UI &amp; Design</option>
                      <option value="New Feature to Add">New Feature to Add</option>
                      <option value="Discord Bot Feature">Discord Bot Feature Idea</option>
                      <option value="Performance / Bug">Bug / Glitch Report</option>
                      <option value="Other">Other / Creative Idea</option>
                    </select>
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Impact Level</label>
                    <select
                      className="collab-select"
                      value={sugPriority}
                      onChange={(e) => setSugPriority(e.target.value)}
                    >
                      <option value="Nice to have">Nice to have (Aesthetic tweak)</option>
                      <option value="Great idea">Great idea (High utility)</option>
                      <option value="Must-Have Gamechanger">Must-Have Gamechanger! 🚀</option>
                    </select>
                  </div>
                </div>

                <div className="collab-form-group full-width">
                  <label className="collab-label">
                    What would you like me to change or add? *
                  </label>
                  <textarea
                    rows="4"
                    className="collab-textarea"
                    placeholder="e.g. It would be amazing if you added a live discord bot commands playground or an interactive terminal mode..."
                    required
                    value={sugText}
                    onChange={(e) => setSugText(e.target.value)}
                  />
                  <div className="collab-char-count">
                    {sugText.length} characters
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <div className="collab-label-with-toggle">
                      <label className="collab-label">Your Name / Alias</label>
                      <label className="collab-anon-toggle">
                        <input
                          type="checkbox"
                          checked={sugIsAnon}
                          onChange={(e) => setSugIsAnon(e.target.checked)}
                        />
                        <span>Stay Anonymous</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder={sugIsAnon ? "Anonymous Supporter" : "Your name or handle"}
                      disabled={sugIsAnon}
                      value={sugIsAnon ? "" : sugName}
                      onChange={(e) => setSugName(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">
                      Discord Tag or Email <small>(Optional, for replies)</small>
                    </label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. @yourdiscord or you@gmail.com"
                      value={sugContact}
                      onChange={(e) => setSugContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collab-checkbox-group">
                  <label className="collab-checkbox-label">
                    <input
                      type="checkbox"
                      checked={sugPublic}
                      onChange={(e) => setSugPublic(e.target.checked)}
                    />
                    <span>
                      Display this suggestion in the public Community Wishlist below
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: JOB OFFER */}
            {activeTab === "job" && (
              <div className="collab-fields-grid">
                <div className="collab-field-banner job-banner">
                  <FiBriefcase className="banner-icon" />
                  <div>
                    <h4>Have a Job Opportunity for Me?</h4>
                    <p>
                      I am open to Full-time, Part-time, Contract, or Developer
                      roles in React, Node.js, Discord Bots, and Full-Stack
                      development.
                    </p>
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">Company / Organization *</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. Acme Corp, Startup, or Community"
                      required
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Position / Role Title *</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. Frontend Engineer, Full-Stack Dev, Bot Specialist"
                      required
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collab-form-row three-col">
                  <div className="collab-form-group">
                    <label className="collab-label">Employment Type</label>
                    <select
                      className="collab-select"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract / Freelance">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Advisor / Consultant">Consultant</option>
                    </select>
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Work Arrangement</label>
                    <select
                      className="collab-select"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                    >
                      <option value="100% Remote">100% Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-Site">On-Site</option>
                    </select>
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Salary / Compensation</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. ₹12L - ₹20L/yr or $60k+/yr"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collab-form-group full-width">
                  <label className="collab-label">
                    Role Description &amp; What You're Building *
                  </label>
                  <textarea
                    rows="4"
                    className="collab-textarea"
                    placeholder="Tell me about your product, tech stack, team culture, and what you'd like me to build..."
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">
                      Recruiter / Contact Email *
                    </label>
                    <input
                      type="email"
                      className="collab-input"
                      placeholder="hiring@company.com"
                      required
                      value={jobContact}
                      onChange={(e) => setJobContact(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">
                      Job Link / Website <small>(Optional)</small>
                    </label>
                    <input
                      type="url"
                      className="collab-input"
                      placeholder="https://company.com/careers"
                      value={jobLink}
                      onChange={(e) => setJobLink(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Urgency</label>
                    <select
                      className="collab-select"
                      value={jobUrgency}
                      onChange={(e) => setJobUrgency(e.target.value)}
                    >
                      <option value="Immediate">Immediate Hire</option>
                      <option value="Within 2-4 weeks">Within 2 - 4 weeks</option>
                      <option value="Next month">Next month</option>
                      <option value="Flexible">Flexible / Exploring</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HIRE FOR WORK / PROJECT */}
            {activeTab === "work" && (
              <div className="collab-fields-grid">
                <div className="collab-field-banner work-banner">
                  <FiFolderPlus className="banner-icon" />
                  <div>
                    <h4>Give Me Work / Freelance Projects</h4>
                    <p>
                      Need an enterprise Discord bot suite, sleek modern React
                      web application, or custom backend integration? Hire me for
                      your project.
                    </p>
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">Project Title / Name *</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. Baddie Cafe Moderation Bot / SaaS Landing Page"
                      required
                      value={workTitle}
                      onChange={(e) => setWorkTitle(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Project Type</label>
                    <select
                      className="collab-select"
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                    >
                      <option value="Discord Bot Suite">Discord Bot (Moderation/Economy/Music)</option>
                      <option value="React Web Application">React Web Application</option>
                      <option value="Full-Stack System">Full-Stack System (Frontend + API)</option>
                      <option value="Landing Page / Portfolio">Landing Page / Portfolio</option>
                      <option value="API & Automation">API / Script / Automation</option>
                      <option value="Bug Fix / Refactor">Bug Fix / Performance Tuning</option>
                    </select>
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">Estimated Budget</label>
                    <select
                      className="collab-select"
                      value={workBudget}
                      onChange={(e) => setWorkBudget(e.target.value)}
                    >
                      <option value="Under $100 / ₹8,000">Under $100 / ₹8,000</option>
                      <option value="$100 - $300 / ₹25k">$100 - $300 / ₹25,000</option>
                      <option value="$300 - $800 / ₹65k">$300 - $800 / ₹65,000</option>
                      <option value="$800+ / ₹65k+">$800+ / ₹65k+ (Enterprise/Large)</option>
                      <option value="Negotiable / Let's Discuss">Negotiable / Open to discuss</option>
                    </select>
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Desired Timeline</label>
                    <select
                      className="collab-select"
                      value={workTimeline}
                      onChange={(e) => setWorkTimeline(e.target.value)}
                    >
                      <option value="Rush (< 1 week)">Rush (&lt; 1 week)</option>
                      <option value="2 - 4 weeks">2 - 4 weeks (Standard)</option>
                      <option value="1 - 2 months">1 - 2 months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="collab-form-group full-width">
                  <label className="collab-label">
                    Project Scope &amp; Deliverables *
                  </label>
                  <textarea
                    rows="4"
                    className="collab-textarea"
                    placeholder="Describe what features you need, any existing codebase, design references, or expectations..."
                    required
                    value={workScope}
                    onChange={(e) => setWorkScope(e.target.value)}
                  />
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">
                      Your Contact (Discord / Email) *
                    </label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. @username on Discord or client@mail.com"
                      required
                      value={workContact}
                      onChange={(e) => setWorkContact(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">
                      Reference Link / Figma / GitHub <small>(Optional)</small>
                    </label>
                    <input
                      type="url"
                      className="collab-input"
                      placeholder="https://figma.com or https://github.com..."
                      value={workLink}
                      onChange={(e) => setWorkLink(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHARE PORTFOLIO & COLLAB */}
            {activeTab === "portfolio" && (
              <div className="collab-fields-grid">
                <div className="collab-field-banner collab-banner">
                  <FaMagic className="banner-icon" />
                  <div>
                    <h4>Share Your Portfolio &amp; Let's Collaborate</h4>
                    <p>
                      Are you a designer, developer, creator, or builder? Show me
                      your portfolio! Let's build open-source projects, hackathons,
                      or SaaS apps together.
                    </p>
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">Your Name / Handle *</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. Rohan, Alex, CyberNinja"
                      required
                      value={collabName}
                      onChange={(e) => setCollabName(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Your Superpower / Role *</label>
                    <input
                      type="text"
                      className="collab-input"
                      placeholder="e.g. UI/UX Designer, 3D Artist, Backend Dev"
                      required
                      value={collabRole}
                      onChange={(e) => setCollabRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collab-form-row">
                  <div className="collab-form-group">
                    <label className="collab-label">
                      Portfolio / GitHub / Behance Link *
                    </label>
                    <input
                      type="url"
                      className="collab-input"
                      placeholder="https://yourportfolio.dev or https://github.com/..."
                      required
                      value={collabPortfolioUrl}
                      onChange={(e) => setCollabPortfolioUrl(e.target.value)}
                    />
                  </div>

                  <div className="collab-form-group">
                    <label className="collab-label">Collaboration Idea</label>
                    <select
                      className="collab-select"
                      value={collabGoal}
                      onChange={(e) => setCollabGoal(e.target.value)}
                    >
                      <option value="Co-build a Web App / SaaS">Co-build a Web App / SaaS</option>
                      <option value="Discord Bot Ecosystem Partnership">Discord Bot Partnership</option>
                      <option value="Portfolio Review & Exchange">Portfolio Feedback &amp; Review</option>
                      <option value="Hackathon Teammate">Hackathon Teammate</option>
                      <option value="General Networking / Chat">Creative Networking / Chat</option>
                    </select>
                  </div>
                </div>

                <div className="collab-form-group full-width">
                  <label className="collab-label">Your Tech Stack &amp; Skills</label>
                  <input
                    type="text"
                    className="collab-input"
                    placeholder="e.g. Figma, Tailwind, Three.js, Python, TypeScript..."
                    value={collabSkills}
                    onChange={(e) => setCollabSkills(e.target.value)}
                  />
                </div>

                <div className="collab-form-group full-width">
                  <label className="collab-label">
                    What would you like us to create together? *
                  </label>
                  <textarea
                    rows="4"
                    className="collab-textarea"
                    placeholder="Tell me your idea, why you want to collaborate, and what we could build..."
                    required
                    value={collabPitch}
                    onChange={(e) => setCollabPitch(e.target.value)}
                  />
                </div>

                <div className="collab-form-group">
                  <label className="collab-label">
                    Discord Tag or Email for Quick Contact *
                  </label>
                  <input
                    type="text"
                    className="collab-input"
                    placeholder="e.g. @username or dev@portfolio.com"
                    required
                    value={collabContact}
                    onChange={(e) => setCollabContact(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="collab-submit-row">
              <button
                type="submit"
                className="btn collab-main-btn"
                disabled={submitting}
              >
                <FiSend />
                <span>
                  {submitting
                    ? "Preparing..."
                    : activeTab === "suggestion"
                    ? "Submit Suggestion"
                    : activeTab === "job"
                    ? "Send Job Offer"
                    : activeTab === "work"
                    ? "Submit Work Proposal"
                    : "Share Portfolio & Pitch"}
                </span>
              </button>

              <div className="collab-guarantee">
                <FaMagic />
                <span>Direct delivery to Saransh · Quick response within 24h</span>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Community Wishlist & Ideas Board */}
      <div className="collab-community-section">
        <div className="collab-community-header">
          <div>
            <h3 className="collab-community-title">
              💡 Community Ideas &amp; Wishlist Board
            </h3>
            <p className="collab-community-desc">
              Vote on what you want added to the website, Discord bots, and tools!
            </p>
          </div>
          <span className="collab-ideas-count">
            {communityIdeas.length} Community Ideas
          </span>
        </div>

        <div className="collab-ideas-grid">
          {communityIdeas.map((idea) => {
            const isUpvoted = upvotedIds.includes(idea.id);
            return (
              <div key={idea.id} className="collab-idea-card">
                <div className="collab-idea-top">
                  <span className="collab-idea-cat">{idea.category}</span>
                  <span className={`collab-idea-status ${idea.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {idea.status}
                  </span>
                </div>
                <h4 className="collab-idea-name">{idea.title}</h4>
                <div className="collab-idea-footer">
                  <span className="collab-idea-author">
                    Suggested by {idea.author}
                  </span>
                  <button
                    type="button"
                    className={`collab-upvote-btn ${isUpvoted ? "voted" : ""}`}
                    onClick={() => handleUpvote(idea.id)}
                    title={isUpvoted ? "Remove upvote" : "Upvote this idea"}
                  >
                    <FiThumbsUp />
                    <span>{idea.votes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Collaborate;
