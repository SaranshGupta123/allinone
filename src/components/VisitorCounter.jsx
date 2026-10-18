import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";

const CLOUD_KEY = "battamizdill_prod_views_2026";
const BASE_OFFSET = 34; // 34 + 1 = 35 starting point
const CACHED_COUNT_KEY = "battamizdill_cached_visitor_count";

function VisitorCounter() {
  // Optimistically show 35 or last cached count while the live server value loads
  const [count, setCount] = useState(() => {
    try {
      const cached = Number(localStorage.getItem(CACHED_COUNT_KEY));
      return !isNaN(cached) && cached >= 35 ? cached : 35;
    } catch {
      return 35;
    }
  });

  useEffect(() => {
    let cancelled = false;

    const fetchLiveCount = async () => {
      let finalCount = null;

      // 1. First attempt: Netlify Function endpoint
      try {
        const netlifyRes = await fetch("/.netlify/functions/visitor-count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (netlifyRes.ok) {
          const netlifyData = await netlifyRes.json();
          const val = Number(netlifyData.visitors);
          if (!isNaN(val) && val >= 35) {
            finalCount = val;
          }
        }
      } catch {
        // Netlify function not running (e.g. local dev server or static host)
      }

      // 2. Direct Cloud Database Sync (works on localhost, Netlify, and even if cookies are cleared)
      if (finalCount === null) {
        try {
          const directRes = await fetch(
            `https://countapi.mileshilliard.com/api/v1/hit/${CLOUD_KEY}`,
            {
              headers: { Accept: "application/json" },
            }
          );

          if (directRes.ok) {
            const directData = await directRes.json();
            const rawVal = Number(directData.value);
            if (!isNaN(rawVal)) {
              finalCount = BASE_OFFSET + rawVal;
            }
          }
        } catch (cloudErr) {
          console.warn("Direct cloud counter notice:", cloudErr);
        }
      }

      if (cancelled) return;

      // Apply the live dynamic server value
      if (finalCount !== null && finalCount >= 35) {
        setCount(finalCount);
        try {
          localStorage.setItem(CACHED_COUNT_KEY, String(finalCount));
        } catch {
          // Ignore storage restriction
        }
      }
    };

    fetchLiveCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="visitor-counter" aria-label="Profile visitor count">
      <FiEye aria-hidden="true" />
      <span>
        <strong>{count.toLocaleString()}</strong>
        <small>Profile Visitors</small>
      </span>
    </div>
  );
}

export default VisitorCounter;
