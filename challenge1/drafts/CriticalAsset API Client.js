// CriticalAsset GraphQL API Client
// Team 6: 345 East 15th Street (HUB 06)

const API_URL = "https://345e15.stg.criticalasset.com/api";
const CLIENT_ID = "ca_4af97452ebf3cc630d6d91a8d7acc8fc";
const CLIENT_SECRET = "1db32fa6e9220572cc17406727aca72c4672057856e50c3d02a5a9357d1a86ab";

// Step 1: Get Access Token
async function getAccessToken() {
  const query = `mutation {
    loginClientCredentialsToken(input: {
      clientId: "${CLIENT_ID}",
      clientSec: "${CLIENT_SECRET}",
      scope: "assets.read locations.read workorders.write",
      tokenType: "realJwt"
    }) {
      accessToken
    }
  }`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Token error: ${JSON.stringify(data.errors)}`);
  }

  return data.data.loginClientCredentialsToken.accessToken;
}

// Step 2: Make authenticated GraphQL requests
async function graphqlRequest(query, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

// Step 3: Main — connect and query
async function main() {
  try {
    console.log("🔑 Requesting access token...");
    const token = await getAccessToken();
    console.log("✅ Token received!\n");

    // Example: Query assets
    console.log("📦 Fetching assets...");
    const assets = await graphqlRequest(`{ assets { id name } }`, token);
    console.log("Assets:", JSON.stringify(assets, null, 2));

    // Example: Query locations
    console.log("\n📍 Fetching locations...");
    const locations = await graphqlRequest(`{ locations { id name } }`, token);
    console.log("Locations:", JSON.stringify(locations, null, 2));

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
