import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Persona } from '../types';

// Ensure API key is present; in a real app, handle this gracefully in UI
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Creates a new chat session with the selected donor persona.
 * Uses gemini-3-pro-preview for high-quality roleplay.
 */
export const createDonorChat = (persona: Persona): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are a roleplay partner for a fundraiser training app. 
      
      YOUR CHARACTER:
      Name: ${persona.name}
      Role: ${persona.role}
      Personality: ${persona.description}
      
      INSTRUCTIONS:
      1. Act strictly as this character. Do not break character.
      2. The user is a fundraiser pitching you for a donation.
      3. Respond naturally to their pitch. Ask tough questions if your character is skeptical. Be warm if your character is generous.
      4. Keep responses concise (under 3-4 sentences) like a real conversation, unless a long explanation is necessary.
      5. If the pitch is vague, press for details.
      6. At the very start, wait for the user to greet you or start the pitch.
      `,
      temperature: 0.7, // Creative but grounded in character
    },
  });
};

/**
 * Uses Google Search Grounding to find facts to help the fundraiser.
 * Uses gemini-2.5-flash for speed and tool usage.
 */
export const searchForFacts = async (query: string): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find accurate, recent information to help a fundraiser with this query: "${query}". Summarize key stats or facts briefly.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No results found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources safely
    const sources = chunks
      .map((chunk) => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title);

    // Remove duplicates based on URI
    const uniqueSourcesMap = new Map<string, { uri: string; title: string }>();
    sources.forEach(source => uniqueSourcesMap.set(source.uri, source));
    const uniqueSources = Array.from(uniqueSourcesMap.values());

    return { text, sources: uniqueSources };
  } catch (error) {
    console.error("Search failed:", error);
    return { 
      text: "Sorry, I couldn't complete the search at this moment. Please try again.", 
      sources: [] 
    };
  }
};