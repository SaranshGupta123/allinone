import { getStore } from "@netlify/blobs";

const STORE_NAME = "battamizdill-proposals-v1";
const PROPOSALS_KEY = "all-proposals-list";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "pragma": "no-cache",
      "expires": "0",
    },
  });

export default async (request, context) => {
  // CORS Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }

  // GET: Retrieve public proposals or status
  if (request.method === "GET") {
    try {
      let store;
      if (context && context.blobs && typeof context.blobs.getStore === "function") {
        store = context.blobs.getStore(STORE_NAME);
      } else {
        store = getStore(STORE_NAME);
      }

      const entry = await store.getWithMetadata(PROPOSALS_KEY, { type: "json" });
      const proposals = Array.isArray(entry?.data) ? entry.data : [];
      return json({ success: true, count: proposals.length, proposals: proposals.slice(-20) });
    } catch (err) {
      console.warn("Netlify Blobs proposals GET notice:", err.message);
      return json({ success: true, count: 0, proposals: [], notice: "Storage fallback" });
    }
  }

  // POST: Save proposal
  if (request.method === "POST") {
    try {
      const payload = await request.json();
      if (!payload || !payload.type) {
        return json({ error: "Missing required fields" }, 400);
      }

      const proposalItem = {
        id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        type: payload.type, // 'suggestion' | 'job' | 'work' | 'portfolio'
        title: payload.title || "New Submission",
        name: payload.name || "Anonymous",
        contact: payload.contact || "None provided",
        details: payload.details || {},
        summary: payload.summary || "",
        isPublic: Boolean(payload.isPublic),
      };

      // Try saving to Netlify Blobs if store is provisioned
      try {
        let store;
        if (context && context.blobs && typeof context.blobs.getStore === "function") {
          store = context.blobs.getStore(STORE_NAME);
        } else {
          store = getStore(STORE_NAME);
        }

        const existing = await store.getWithMetadata(PROPOSALS_KEY, { type: "json" });
        const list = Array.isArray(existing?.data) ? existing.data : [];
        list.unshift(proposalItem);
        // keep up to 100 recent proposals
        const trimmed = list.slice(0, 100);
        await store.setJSON(PROPOSALS_KEY, trimmed);
      } catch (storeErr) {
        console.warn("Netlify Blobs proposals POST notice:", storeErr.message);
      }

      return json({
        success: true,
        message: "Proposal successfully received!",
        id: proposalItem.id,
      });
    } catch (parseErr) {
      return json({ error: "Invalid JSON payload", details: parseErr.message }, 400);
    }
  }

  return json({ error: "Method not allowed" }, 405);
};
