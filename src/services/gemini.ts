import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askAI(prompt: string, context?: string) {
  try {
    const fullPrompt = `You are a Senior Amadeus GDS Instructor. 
    The user is learning the GDS terminal. 
    If the user asks for a flight, explain the entry: AN[DATE][ORIG][DEST].
    If the user is confused, list these steps:
    1. AN for Availability
    2. SS to Sell a seat
    3. NM1 for Name
    4. AP for Phone
    5. TK TL for Ticketing limit
    6. ER to Save.
    
    Current Terminal Context: ${context || 'None'}
    User: ${prompt}
    
    Answer in Arabic if asked in Arabic, otherwise English. Be very professional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: fullPrompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I encountered an error while processing your request.";
  }
}
