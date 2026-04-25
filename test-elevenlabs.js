require('dotenv').config({ path: '.env.local' });
async function test() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  console.log("Agent:", agentId);
  console.log("API Key exists:", !!apiKey);
  
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      method: "GET",
      headers: { "xi-api-key": apiKey },
    }
  );
  console.log("Status:", response.status);
  const data = await response.json();
  console.log("Data:", data);
}
test();
