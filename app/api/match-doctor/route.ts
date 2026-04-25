import { NextResponse } from "next/server";

const DOCTORS_LIST = [
  { id: "aria", name: "Dr. Aria", specialty: "General Practitioner", description: "Everyday illnesses, colds, infections, and general wellness." },
  { id: "kai", name: "Dr. Kai", specialty: "Mental Health Specialist", description: "Anxiety, depression, stress, and sleep disorders." },
  { id: "nova", name: "Dr. Nova", specialty: "Nutritionist & Dietitian", description: "Diet, gut health, food sensitivities, and metabolic concerns." },
  { id: "orion", name: "Dr. Orion", specialty: "Urgent Care Advisor", description: "Triage urgent symptoms and emergency care guidance." },
  { id: "sol", name: "Dr. Sol", specialty: "Dermatologist", description: "Skin conditions, rashes, acne, and eczema." },
  { id: "vera", name: "Dr. Vera", specialty: "Cardiologist", description: "Heart health, blood pressure, and cholesterol." },
  { id: "mira", name: "Dr. Mira", specialty: "Pediatrician", description: "Child health and developmental milestones." },
  { id: "rex", name: "Dr. Rex", specialty: "Orthopedic Specialist", description: "Joint pain, sports injuries, and back pain." },
  { id: "lena", name: "Dr. Lena", specialty: "Women's Health", description: "Reproductive health, hormones, and prenatal support." },
  { id: "zen", name: "Dr. Zen", specialty: "Sleep & Neurology", description: "Insomnia, migraines, and neurological symptoms." },
];

export async function POST(req: Request) {
  try {
    const { symptoms, duration, severity } = await req.json();

    if (!symptoms) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
    }

    const prompt = `
      You are an expert medical triage assistant for "AI Doctor Pro".
      Based on the following user input, identify the top 3 most relevant AI doctors from the provided list.
      
      User Input:
      - Symptoms: ${symptoms}
      - Duration: ${duration}
      - Severity: ${severity}/10
      
      Doctor List:
      ${DOCTORS_LIST.map(d => `- ${d.id}: ${d.name} (${d.specialty}) - ${d.description}`).join("\n")}
      
      Return ONLY a JSON array of the top 3 doctor IDs in order of relevance.
      Example format: ["aria", "zen", "mira"]
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ai-doctor-pro.com",
        "X-Title": "AI Doctor Pro",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Symptoms: ${symptoms}\nDuration: ${duration}\nSeverity: ${severity}/10` }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error("OpenRouter API Error Response:", data);
      throw new Error("No choices returned from AI provider");
    }

    const content = data.choices[0].message.content;
    
    // Attempt to parse the array from the response
    const match = content.match(/\[.*\]/);
    if (match) {
        return NextResponse.json({ recommendations: JSON.parse(match[0]) });
    }

    // Fallback if formatting is weird
    return NextResponse.json({ recommendations: ["aria", "orion", "kai"] });
  } catch (error) {
    console.error("AI Match Error:", error);
    return NextResponse.json({ recommendations: ["aria", "orion", "kai"] }, { status: 200 }); // Graceful fallback
  }
}
