import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiEye,
  FiMoon,
  FiBookOpen,
  FiArrowDown,
  FiArrowUp,
  FiCoffee,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiX,
  FiMove,
  FiCamera,
  FiNavigation,
  FiStar,
} from "react-icons/fi";

import idleSprite from "../assets/mascot/idle.png";
import sleepingSprite from "../assets/mascot/sleeping.png";
import readingSprite from "../assets/mascot/reading.png";
import pointingSprite from "../assets/mascot/pointing.png";
import jumpingSprite from "../assets/mascot/jumping.png";
import coffeeSprite from "../assets/mascot/coffee.png";
import cosplayPhoto from "../assets/mascot/cosplay_photo.jpg";
import realPortrait from "../assets/mascot/real_portrait.png";

import { playMascotSound } from "../utils/mascotAudio";
import "./Mascot.css";

const ACTIVITIES = [
  { id: "seeing", label: "Byakugan", icon: FiEye, sprite: idleSprite },
  { id: "sleeping", label: "Sleeping", icon: FiMoon, sprite: sleepingSprite },
  { id: "reading", label: "Reading", icon: FiBookOpen, sprite: readingSprite },
  { id: "pointing", label: "Pointing", icon: FiNavigation, sprite: pointingSprite },
  { id: "coffee", label: "Tea", icon: FiCoffee, sprite: coffeeSprite },
];

const SPEECHES = {
  welcome: "U-Um... Hi! I'm Hinata 🌸 Perched on the header — explore Saransh's portfolio with me!",
  seeing: "Byakugan! 👀 Tracking your moves with 360° ninja vision!",
  sleeping: "Zzz... dreaming of Konoha and clean code... 😴",
  reading: "📖 Studying Saransh's ninja tools: Discord bots, React, and FastAPI pipelines!",
  pointing: "👉 Byakugan activated! Check out the projects and skills over there!",
  coffee: "🍵 Fresh brewed warm tea before coding missions! So comforting~",
  jumpDown: "Gentle Step! Leaping all the way down to the footer! 🚀",
  jumpUp: "Ninja leap back to the header! 💫",
  landedFooter: "Touchdown at the footer! 🌸 Check out the visitor count and contact info!",
  landedHeader: "Back on the header! Guardian of the top navbar! ✨",
  wakeUp: "Yaaawn... *stretches shyly* Good morning! Let's explore together! 💖",
  clicked: [
    "Hehe... that tickles! 🌸",
    "Konoha headband on neck: +100 chakra, +100 courage! 💜",
    "I will never give up on this code... that's my ninja way! 🛡️",
    "Did you know? Saransh builds bots for thousands of members!",
    "Need guidance? Try tapping my activities menu! 🪄",
  ],
};

function Mascot() {
  const [activity, setActivity] = useState("seeing");
  const [location, setLocation] = useState("header"); // 'header' | 'footer' | 'custom'
  const [customPos, setCustomPos] = useState({ x: null, y: null });
  const [isJumping, setIsJumping] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [tilt, setTilt] = useState(0);
  const [speech, setSpeech] = useState(SPEECHES.welcome);
  const [showSpeech, setShowSpeech] = useState(true);
  const [showDock, setShowDock] = useState(false); // Collapsed by default for clean mobile view
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 680;
      setIsMobile(mobile);
      // Auto open dock on large desktop screens on first load
      if (window.innerWidth > 1024) {
        setShowDock(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Clamp custom position on screen resize
  useEffect(() => {
    const handleResize = () => {
      setCustomPos((prev) => {
        if (prev.x === null || prev.y === null) return prev;
        const size = isMobile ? 70 : 100;
        return {
          x: Math.max(8, Math.min(window.innerWidth - size - 8, prev.x)),
          y: Math.max(8, Math.min(window.innerHeight - size - 8, prev.y)),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Helper to update speech with auto-dismiss
  const say = useCallback((text, duration = 4500) => {
    setSpeech(text);
    setShowSpeech(true);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (duration > 0) {
      speechTimerRef.current = setTimeout(() => {
        setShowSpeech(false);
      }, duration);
    }
  }, []);

  // Initial greeting
  useEffect(() => {
    say(SPEECHES.welcome, 5000);
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [say]);

  // Mouse & Touch tracking for "seeing to mouse"
  const trackTarget = useCallback(
    (clientX, clientY) => {
      if (isJumping || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      if (activity === "seeing" || activity === "pointing") {
        if (dx < -15) setFacing(-1);
        else if (dx > 15) setFacing(1);

        const maxTilt = 10;
        const angle = Math.max(-maxTilt, Math.min(maxTilt, (dx / window.innerWidth) * 20));
        setTilt(angle);

        const dist = Math.hypot(dx, dy);
        if (dist < 90 && activity === "seeing" && Math.random() < 0.008) {
          say("I see you! 👀", 2500);
        }
      }
    },
    [activity, isJumping, say]
  );

  useEffect(() => {
    const handleMouseMove = (e) => trackTarget(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        trackTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [trackTarget]);

  // Auto-Play activity cycling
  useEffect(() => {
    if (!autoPlay || isJumping || activity === "sleeping") return;

    const cycleActivities = ["seeing", "reading", "coffee", "pointing"];
    autoPlayTimerRef.current = setInterval(() => {
      setActivity((prev) => {
        const nextIdx = (cycleActivities.indexOf(prev) + 1) % cycleActivities.length;
        const nextAct = cycleActivities[nextIdx];
        if (nextAct === "reading") say(SPEECHES.reading, 4000);
        else if (nextAct === "coffee") {
          say(SPEECHES.coffee, 4000);
          playMascotSound("coffee", isMuted);
        } else if (nextAct === "pointing") {
          say(SPEECHES.pointing, 4000);
          playMascotSound("sparkle", isMuted);
        } else if (nextAct === "seeing") {
          say(SPEECHES.seeing, 3500);
        }
        return nextAct;
      });
    }, 14000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, isJumping, activity, isMuted, say]);

  // Handle jump between Header and Footer
  const handleJump = useCallback(() => {
    if (isJumping) return;

    setIsJumping(true);
    playMascotSound("jump", isMuted);

    const willLandAtFooter = location === "header" || location === "custom";

    if (willLandAtFooter) {
      say(SPEECHES.jumpDown, 2500);
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      say(SPEECHES.jumpUp, 2500);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      setIsJumping(false);
      setShowShockwave(true);
      playMascotSound("land", isMuted);

      if (willLandAtFooter) {
        setLocation("footer");
        setCustomPos({ x: null, y: null });
        setActivity("coffee");
        say(SPEECHES.landedFooter, 4500);
      } else {
        setLocation("header");
        setCustomPos({ x: null, y: null });
        setActivity("seeing");
        say(SPEECHES.landedHeader, 4500);
      }

      setTimeout(() => setShowShockwave(false), 800);
    }, 1250);
  }, [isJumping, location, isMuted, say]);

  // Switch activity manually
  const selectActivity = (actId) => {
    if (isJumping) return;
    setActivity(actId);

    if (actId === "sleeping") {
      say(SPEECHES.sleeping, 4500);
      playMascotSound("sleep", isMuted);
    } else if (actId === "reading") {
      say(SPEECHES.reading, 4000);
      playMascotSound("magic", isMuted);
    } else if (actId === "coffee") {
      say(SPEECHES.coffee, 4000);
      playMascotSound("coffee", isMuted);
    } else if (actId === "pointing") {
      say(SPEECHES.pointing, 4000);
      playMascotSound("sparkle", isMuted);
    } else if (actId === "seeing") {
      say(SPEECHES.seeing, 3500);
      playMascotSound("pop", isMuted);
    }

    // On mobile, auto-close dock after picking activity so screen remains clear
    if (isMobile) {
      setShowDock(false);
    }
  };

  // Clicking on character body
  const handleAvatarClick = () => {
    if (isJumping) return;

    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);

    if (activity === "sleeping") {
      setActivity("seeing");
      say(SPEECHES.wakeUp, 4500);
      playMascotSound("magic", isMuted);
      return;
    }

    playMascotSound("pop", isMuted);

    // If dock is closed on mobile, open it when character is clicked
    if (isMobile && !showDock) {
      setShowDock(true);
      return;
    }

    const randomLine =
      SPEECHES.clicked[Math.floor(Math.random() * SPEECHES.clicked.length)];
    say(randomLine, 3500);
  };

  // Drag handlers (Mouse + Touch)
  const startDrag = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      initialX: rect.left,
      initialY: rect.top,
    };
  };

  const updateDrag = (clientX, clientY) => {
    if (!dragRef.current.isDragging) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    const size = isMobile ? 70 : 100;
    setLocation("custom");
    setCustomPos({
      x: Math.max(8, Math.min(window.innerWidth - size - 8, dragRef.current.initialX + dx)),
      y: Math.max(8, Math.min(window.innerHeight - size - 8, dragRef.current.initialY + dy)),
    });
  };

  const endDrag = () => {
    dragRef.current.isDragging = false;
  };

  const handleMouseDown = (e) => {
    if (
      e.target.closest(".mascot-dock") ||
      e.target.closest(".mascot-speech-bubble") ||
      e.target.closest(".mascot-mini-toggle")
    ) {
      return;
    }
    startDrag(e.clientX, e.clientY);

    const onMove = (moveEvt) => updateDrag(moveEvt.clientX, moveEvt.clientY);
    const onUp = () => {
      endDrag();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleTouchStart = (e) => {
    if (
      e.target.closest(".mascot-dock") ||
      e.target.closest(".mascot-speech-bubble") ||
      e.target.closest(".mascot-mini-toggle")
    ) {
      return;
    }
    if (e.touches && e.touches[0]) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (dragRef.current.isDragging && e.touches && e.touches[0]) {
      updateDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // Get current active sprite
  const currentSprite = isJumping
    ? jumpingSprite
    : ACTIVITIES.find((a) => a.id === activity)?.sprite || idleSprite;

  const containerStyle = {
    ...(location === "custom" && customPos.x !== null
      ? {
          left: `${customPos.x}px`,
          top: `${customPos.y}px`,
          right: "auto",
          bottom: "auto",
        }
      : {}),
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`mascot-container anchor-${location} ${
          isJumping ? "is-jumping" : ""
        } ${isMobile ? "is-mobile" : ""}`}
        data-activity={activity}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Interactive Magical Mascot Companion"
      >
        {/* Shockwave on landing */}
        {showShockwave && <div className="mascot-shockwave" />}

        {/* Trail when jumping */}
        {isJumping && <div className="mascot-jump-trail" />}

        {/* Speech Bubble */}
        {showSpeech && (
          <div
            className={`mascot-speech-bubble ${
              location === "header" ? "bubble-down" : "bubble-up"
            }`}
            onClick={() => setShowSpeech(false)}
            title="Tap to dismiss"
          >
            <div className="mascot-bubble-tag">Hinata Hyūga 🌸</div>
            <div>{speech}</div>
          </div>
        )}

        {/* Mascot Character Avatar */}
        <div
          className={`mascot-avatar ${isWiggling ? "wiggling" : ""}`}
          style={{
            transform: `scaleX(${facing}) rotate(${facing * tilt}deg)`,
          }}
          onClick={handleAvatarClick}
          title="Tap or click to interact!"
        >
          {/* Ground shadow */}
          <div className="mascot-ground-shadow" />

          {/* Activity specific particle effects */}
          {activity === "sleeping" && (
            <div className="mascot-zzz-container">
              <span className="mascot-zzz">z</span>
              <span className="mascot-zzz">Z</span>
              <span className="mascot-zzz">Z</span>
            </div>
          )}

          {activity === "coffee" && (
            <div className="mascot-steam-container">
              <div className="mascot-steam-puff" />
              <div className="mascot-steam-puff" />
              <div className="mascot-steam-puff" />
            </div>
          )}

          {activity === "reading" && <div className="mascot-spell-ring" />}

          <img
            src={currentSprite}
            alt={`Hinata Hyūga - ${activity}`}
            className="mascot-sprite"
            draggable={false}
          />
        </div>

        {/* Quick Mini Toggle when dock is closed */}
        {!showDock && (
          <button
            type="button"
            className="mascot-mini-toggle"
            onClick={() => setShowDock(true)}
            aria-label="Open Companion Controls"
          >
            ✨ Menu
          </button>
        )}

        {/* Desktop floating dock (when not mobile) */}
        {!isMobile && showDock && (
          <div className="mascot-dock desktop-dock">
            <button
              type="button"
              className="mascot-dock-btn action-leap"
              onClick={handleJump}
              title={
                location === "header"
                  ? "Leap all the way down to Footer"
                  : "Leap back up to Header"
              }
            >
              {location === "header" ? (
                <>
                  <FiArrowDown /> Footer
                </>
              ) : (
                <>
                  <FiArrowUp /> Header
                </>
              )}
            </button>

            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  type="button"
                  className={`mascot-dock-btn ${
                    activity === act.id ? "active" : ""
                  }`}
                  onClick={() => selectActivity(act.id)}
                  title={act.label}
                >
                  <Icon />
                  <span className="mascot-dock-btn-label">{act.label}</span>
                </button>
              );
            })}

            {location === "custom" && (
              <button
                type="button"
                className="mascot-dock-btn"
                onClick={() => {
                  setLocation("header");
                  setCustomPos({ x: null, y: null });
                  say("Returned to header! 🏠", 2500);
                }}
                title="Reset to Header"
              >
                <FiMove /> Header
              </button>
            )}

            <button
              type="button"
              className={`mascot-dock-btn ${autoPlay ? "active" : ""}`}
              onClick={() => {
                setAutoPlay(!autoPlay);
                say(
                  !autoPlay
                    ? "Auto-play enabled! ✨"
                    : "Auto-play paused.",
                  2500
                );
              }}
              title={autoPlay ? "Pause Auto-Play" : "Start Auto-Play"}
            >
              {autoPlay ? <FiPause /> : <FiPlay />}
            </button>

            <button
              type="button"
              className="mascot-dock-btn"
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playMascotSound("sparkle", false);
              }}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>

            <button
              type="button"
              className="mascot-dock-btn"
              onClick={() => setShowPhotoModal(true)}
              title="View original cosplay photo"
            >
              <img
                src={realPortrait}
                alt="Cosplay"
                style={{ width: 16, height: 16, borderRadius: "50%" }}
              />
              <span className="mascot-dock-btn-label">Cosplay</span>
            </button>

            <button
              type="button"
              className="mascot-dock-btn"
              onClick={() => setShowDock(false)}
              title="Hide controls"
            >
              <FiX />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Action Sheet (when mobile and dock is open) */}
      {isMobile && showDock && (
        <div
          className="mascot-mobile-sheet-backdrop"
          onClick={() => setShowDock(false)}
        >
          <div
            className="mascot-mobile-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Companion Controls"
          >
            <div className="mascot-mobile-sheet-header">
              <div className="mascot-mobile-sheet-title">
                <FiStar style={{ color: "var(--mascot-pink)" }} />
                <span>Companion Controls</span>
              </div>
              <button
                type="button"
                className="mascot-mobile-sheet-close"
                onClick={() => setShowDock(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            {/* Jump Action Card */}
            <button
              type="button"
              className="mascot-mobile-jump-btn"
              onClick={() => {
                handleJump();
                setShowDock(false);
              }}
            >
              {location === "header" ? (
                <>
                  <FiArrowDown /> Leap Down to Footer
                </>
              ) : (
                <>
                  <FiArrowUp /> Super Leap to Header
                </>
              )}
            </button>

            {/* Activities Grid */}
            <div className="mascot-mobile-grid">
              {ACTIVITIES.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    type="button"
                    className={`mascot-mobile-grid-btn ${
                      activity === act.id ? "active" : ""
                    }`}
                    onClick={() => selectActivity(act.id)}
                  >
                    <Icon className="btn-icon" />
                    <span>{act.label}</span>
                  </button>
                );
              })}

              {/* Reset to Header if custom */}
              {location === "custom" && (
                <button
                  type="button"
                  className="mascot-mobile-grid-btn"
                  onClick={() => {
                    setLocation("header");
                    setCustomPos({ x: null, y: null });
                    setShowDock(false);
                    say("Returned to header! 🏠", 2500);
                  }}
                >
                  <FiMove className="btn-icon" />
                  <span>To Header</span>
                </button>
              )}

              {/* Auto play toggle */}
              <button
                type="button"
                className={`mascot-mobile-grid-btn ${autoPlay ? "active" : ""}`}
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? (
                  <FiPause className="btn-icon" />
                ) : (
                  <FiPlay className="btn-icon" />
                )}
                <span>{autoPlay ? "Auto: On" : "Auto: Off"}</span>
              </button>

              {/* Sound toggle */}
              <button
                type="button"
                className={`mascot-mobile-grid-btn ${!isMuted ? "active" : ""}`}
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) playMascotSound("sparkle", false);
                }}
              >
                {!isMuted ? (
                  <FiVolume2 className="btn-icon" />
                ) : (
                  <FiVolumeX className="btn-icon" />
                )}
                <span>{!isMuted ? "Sound: On" : "Sound: Muted"}</span>
              </button>

              {/* View Cosplay Photo */}
              <button
                type="button"
                className="mascot-mobile-grid-btn cosplay-card-btn"
                onClick={() => {
                  setShowDock(false);
                  setShowPhotoModal(true);
                }}
              >
                <img
                  src={realPortrait}
                  alt="Cosplay"
                  style={{ width: 22, height: 22, borderRadius: "50%" }}
                />
                <span>Cosplay Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Cosplay Photo Modal */}
      {showPhotoModal && (
        <div
          className="mascot-photo-modal-backdrop"
          onClick={() => setShowPhotoModal(false)}
        >
          <div
            className="mascot-photo-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mascot-photo-card-header">
              <h3>
                <FiCamera style={{ color: "var(--mascot-pink)" }} />
                Hinata Hyūga Cosplay
              </h3>
              <button
                type="button"
                className="mascot-photo-card-close"
                onClick={() => setShowPhotoModal(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="mascot-photo-card-body">
              <div className="mascot-photo-frame">
                <img
                  src={cosplayPhoto}
                  alt="Hinata Hyūga Cosplay"
                />
              </div>

              <div className="mascot-photo-badge">
                <FiStar /> Hinata Hyūga · Hidden Leaf Village Cosplay
              </div>

              <p className="mascot-photo-caption">
                The real Hinata Hyūga cosplay by the bed with the Konoha headband and lavender ninja jacket!
                This photo inspired Hinata as your interactive companion watching over the website.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Mascot;
