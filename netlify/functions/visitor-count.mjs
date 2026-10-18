import { getStore } from "@netlify/blobs";

// Cloud persistent key & store for true global dynamic counting
const COUNT_API_KEY = "battamizdill_prod_views_2026";
const BASE_OFFSET = 34; // 34 + 1 = 35 starting count
const STORE_NAME = "battamizdill-analytics-v2";
const COUNTER_KEY = "profile-visitors-total";

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

// Cloud hit / get helper
async function hitCloudCounter(isIncrement = true) {
  const endpoint = isIncrement ? "hit" : "get";
  const url = `https://countapi.mileshilliard.com/api/v1/${endpoint}/${COUNT_API_KEY}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Netlify-Function-VisitorCounter/2.0" },
  });
  if (!res.ok) throw new Error(`Cloud counter returned ${res.status}`);
  const data = await res.json();
  const rawValue = Number(data.value);
  return BASE_OFFSET + (isNaN(rawValue) ? 1 : rawValue);
}

export default async (request, context) => {
  if (request.method !== "GET" && request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const isIncrement = request.method === "POST";

  // 1. Try Global Persistent Cloud Counter API (True global persistence across all devices & cookie clears)
  try {
    const cloudVisitors = await hitCloudCounter(isIncrement);
    return json({ visitors: cloudVisitors });
  } catch (cloudErr) {
    console.warn("Cloud counter fallback triggered:", cloudErr.message);
  }

  // 2. Secondary fallback: Netlify Blobs if provisioned
  try {
    let store;
    if (context && context.blobs && typeof context.blobs.getStore === "function") {
      store = context.blobs.getStore(STORE_NAME);
    } else {
      store = getStore(STORE_NAME);
    }

    const entry = await store.getWithMetadata(COUNTER_KEY, { type: "json" });
    const currentVal = entry?.data?.value ? Number(entry.data.value) : 35;
    const nextVal = isIncrement ? currentVal + 1 : currentVal;

    if (isIncrement) {
      await store.setJSON(COUNTER_KEY, { value: nextVal });
    }

    return json({ visitors: nextVal });
  } catch (blobsErr) {
    console.warn("Blobs fallback notice:", blobsErr.message);
  }

  // Baseline minimum
  return json({ visitors: 35 });
};
