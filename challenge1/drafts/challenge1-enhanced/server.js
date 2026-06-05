// Challenge 01: Work Order Dashboard — Backend Server
// Team 6: 345 East 15th Street (HUB 06)
// The City Hacks The State · NYC Tech Week 2026

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const API_URL = "https://345e15.stg.criticalasset.com/api";
const CLIENT_ID = "ca_4af97452ebf3cc630d6d91a8d7acc8fc";
const CLIENT_SECRET = "1db32fa6e9220572cc17406727aca72c4672057856e50c3d02a5a9357d1a86ab";

let tokenCache = { accessToken: null, refreshToken: null, expiresAt: 0 };

// --- Auth ---
async function getToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  const query = `mutation {
    applicationClientCredentialsToken(input: {
      clientId: "${CLIENT_ID}",
      clientSecret: "${CLIENT_SECRET}",
      scope: "assets.read locations.read workorders.read workorders.write"
    }) { accessToken refreshToken tokenType expiresIn scope }
  }`;

  const data = await graphqlPost(query, null);
  const result = data.data.applicationClientCredentialsToken;
  tokenCache = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt: Date.now() + result.expiresIn * 1000,
  };
  return result.accessToken;
}

// --- GraphQL Helper ---
function graphqlPost(query, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const url = new URL(API_URL);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = https.request(
      { hostname: url.hostname, port: 443, path: url.pathname, method: "POST", headers },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`Parse error: ${data.substring(0, 200)}`)); }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// --- Data Fetchers ---
async function fetchWorkOrders(token) {
  const query = `query {
    workOrders(limit: 50) {
      totalCount
      nodes {
        id title description severity executionPriority
        workOrderStage { name }
        asset { id name category status }
        location { id locationName }
        createdAt updatedAt
      }
    }
  }`;
  return graphqlPost(query, token);
}

async function fetchAssets(token) {
  const query = `query {
    assets(limit: 100) {
      total
      assets { id name status serialNumber category installationDate
        locations { id locationName }
      }
    }
  }`;
  return graphqlPost(query, token);
}

async function fetchLocations(token) {
  const query = `query {
    locations(limit: 50) {
      total
      locations { id locationName address }
    }
  }`;
  return graphqlPost(query, token);
}

// --- API Routes ---
async function handleAPI(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

  try {
    const token = await getToken();

    if (req.url === "/api/dashboard") {
      const [woRes, assetRes, locRes] = await Promise.all([
        fetchWorkOrders(token),
        fetchAssets(token),
        fetchLocations(token),
      ]);
      res.writeHead(200);
      res.end(JSON.stringify({
        workOrders: woRes.data?.workOrders || woRes,
        assets: assetRes.data?.assets || assetRes,
        locations: locRes.data?.locations || locRes,
      }));
    } else if (req.url === "/api/work-orders") {
      const result = await fetchWorkOrders(token);
      res.writeHead(200);
      res.end(JSON.stringify(result.data || result));
    } else if (req.url === "/api/assets") {
      const result = await fetchAssets(token);
      res.writeHead(200);
      res.end(JSON.stringify(result.data || result));
    } else if (req.url === "/api/locations") {
      const result = await fetchLocations(token);
      res.writeHead(200);
      res.end(JSON.stringify(result.data || result));
    } else if (req.url === "/api/student-signal" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        const { workOrderId, observation } = JSON.parse(body);
        // Attach student observation as a note/comment to the work order
        const mutation = `mutation {
          updateWorkOrder(id: "${workOrderId}", input: {
            description: "${observation}"
          }) { id title description }
        }`;
        const result = await graphqlPost(mutation, token);
        res.writeHead(200);
        res.end(JSON.stringify(result.data || result));
      });
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
}

// --- Static File Server ---
function serveStatic(req, res) {
  const filePath = req.url === "/" ? "/index.html" : req.url;
  const fullPath = path.join(__dirname, "public", filePath);
  const ext = path.extname(fullPath);
  const mimeTypes = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".png": "image/png" };

  fs.readFile(fullPath, (err, data) => {
    if (err) return handleAPI(req, res);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(data);
  });
}

// --- Server ---
const server = http.createServer(serveStatic);
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Challenge 1 Dashboard running at http://localhost:${PORT}\n`);
  console.log("  /api/dashboard    — Full dashboard data (work orders + assets + locations)");
  console.log("  /api/work-orders  — Work orders only");
  console.log("  /api/assets       — Assets only");
  console.log("  /api/locations    — Locations only");
  console.log("  POST /api/student-signal — Submit student observation\n");
});
