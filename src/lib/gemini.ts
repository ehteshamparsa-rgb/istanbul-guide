import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, ItineraryResponse } from "../types";

// Initialize Gemini AI
// Using gemini-2.5-flash-latest as the robust flash model for this task
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          theme: { type: Type.STRING },
          morning: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              tips: { type: Type.STRING },
              transport: { type: Type.STRING, description: "How to get here from the previous location or base." },
              rating: { type: Type.STRING, description: "Google Maps rating e.g., '4.8/5'" },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              transport: { type: Type.STRING },
              rating: { type: Type.STRING },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
          afternoon: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              tips: { type: Type.STRING },
              transport: { type: Type.STRING },
              rating: { type: Type.STRING },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
          sunset: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              transport: { type: Type.STRING },
              rating: { type: Type.STRING },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              transport: { type: Type.STRING },
              rating: { type: Type.STRING },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
          evening: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              transport: { type: Type.STRING },
              rating: { type: Type.STRING },
            },
            required: ["name", "location", "description", "priceRange", "transport", "rating"],
          },
        },
        required: ["day", "theme", "morning", "lunch", "afternoon", "sunset", "dinner", "evening"],
      },
    },
    essentialTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    neighborhoodGuide: { type: Type.STRING },
    gettingAround: { type: Type.STRING },
    budgetBreakdown: { type: Type.STRING },
    costTable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "e.g., 'Street Food', 'Museum Entry', 'Taxi (Short Ride)'" },
          averageCost: { type: Type.STRING, description: "e.g., '$2-5', '$15-20'" },
          tips: { type: Type.STRING, description: "Short tip e.g., 'Cash only', 'Use Museum Pass'" },
        },
        required: ["category", "averageCost", "tips"],
      },
    },
    localPhrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: { type: Type.STRING },
          meaning: { type: Type.STRING },
        },
        required: ["phrase", "meaning"],
      },
    },
    emergencyContacts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          number: { type: Type.STRING },
        },
        required: ["name", "number"],
      },
    },
    donts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "itinerary",
    "essentialTips",
    "neighborhoodGuide",
    "gettingAround",
    "budgetBreakdown",
    "costTable",
    "localPhrases",
    "emergencyContacts",
    "donts",
  ],
};

export async function generateItinerary(prefs: UserPreferences): Promise<ItineraryResponse> {
  const locationString = prefs.userLocation 
    ? `Latitude: ${prefs.userLocation.lat}, Longitude: ${prefs.userLocation.lng}` 
    : prefs.accommodationArea;

  const prompt = `
    Act as an expert local travel planner for Istanbul with the logic of a routing engine (like Google Maps).
    
    User Request:
    - Create a ${prefs.days}-day itinerary.
    - **Base Location**: ${locationString}
    - Budget: $${prefs.budget} USD per person per day
    - Style: ${prefs.travelStyle.join(", ")}
    - Travelers: ${prefs.travelers}
    - Season: ${prefs.season}
    - Interests: ${prefs.interests.join(", ")}
    - **Output Language**: ${prefs.language} (The entire response MUST be in this language)

    **CRITICAL LOGIC & ROUTING RULES:**
    1.  **STRICT PROXIMITY**: You MUST prioritize locations closest to the **Base Location** (${locationString}).
        - **Morning/Breakfast**: MUST be within walking distance (max 15 mins) of Base Location.
        - **Dinner/Evening**: MUST be near Base Location unless it's a specific "Night Out" theme.
    2.  **HIGH RATINGS ONLY**: Suggest places that have **High Ratings (4.5+ stars)** on Google Maps/Internet.
        - **DO NOT** suggest generic or low-rated places.
        - If a place is famous but has a lower rating, mention it in the description.
    3.  **Daytime Clustering**: Group activities geographically. Do NOT make the user cross the Bosphorus multiple times in one day.
        - Example: If Day 1 is "Old City", all activities (Lunch, Afternoon, Sunset) must be in Fatih/Sultanahmet.
        - Example: If Day 2 is "Asian Side", all activities must be in Kadikoy/Uskudar.
    4.  **Transport Logic**: Explicitly mention how to get from the Base Location to the first activity of the day (e.g., "Take the T1 Tram from [Station]...").
    5.  **Cost Table**: Provide a table of approximate costs for common items (e.g., Simit, Tea, Museum Ticket, Dinner) relevant to the user's budget level.

    **Itinerary Structure:**
    - **Day Theme**: Give a catchy title.
    - **Morning**: Start near ${locationString} OR travel to a specific zone.
    - **Lunch**: Must be near the Morning activity.
    - **Afternoon**: Must be near the Lunch spot.
    - **Sunset**: Best view near the Afternoon spot.
    - **Dinner**: Return near ${locationString} OR a famous spot reachable by direct transport.
    - **Evening**: Relaxed spot near Dinner.

    **Output Requirements:**
    - Return strictly valid JSON matching the schema.
    - Tone: Professional, Local Expert, Logical.
    - **NO** generic advice. Be specific.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
      },
    });

    let text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    // Clean markdown code blocks if present
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    return JSON.parse(text) as ItineraryResponse;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}
