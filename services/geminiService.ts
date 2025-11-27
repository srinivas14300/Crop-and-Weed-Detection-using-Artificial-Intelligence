
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `You are an agricultural expert AI specializing in precision farming and agronomy. 
            Analyze the provided image and classify the main subject as either a "Crop" (a beneficial plant intended for harvest) or a "Weed" (an unwanted plant competing for resources).
            
            If the image is not a plant or it's too unclear, classify as "Unknown".
            
            Provide the following structured analysis:
            1. Classification & Confidence (0-100).
            2. Type Name: Scientific name and common name (e.g., "Zea mays (Maize)").
            3. Explanation: A simple 1-sentence explanation for a non-expert.
            4. Summary: A concise status summary (e.g., "Healthy crop identified" or "Invasive broadleaf weed detected").
            5. AI Reasoning: Detailed technical visual reasoning for the classification (leaf shape, venation, growth pattern).
            6. Growth Info: Biological facts, growth habits, or risks associated with this plant.
            7. Solutions: 3 actionable agronomic solutions or recommendations.
            8. Drone Actions: 3 specific drone-based interventions, monitoring tasks, or spectral analysis suggestions.
            
            If classification is "Unknown", provide tips on taking better photos in the solutions.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              enum: ["Crop", "Weed", "Unknown"],
            },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            typeName: { type: Type.STRING },
            summary: { type: Type.STRING },
            aiReasoning: { type: Type.STRING },
            growthInfo: { type: Type.STRING },
            solutions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            droneActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["classification", "confidence", "explanation", "typeName", "summary", "aiReasoning", "growthInfo", "solutions", "droneActions"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      classification: result.classification || "Unknown",
      confidence: result.confidence || 0,
      explanation: result.explanation || "Could not analyze image.",
      typeName: result.typeName,
      summary: result.summary,
      aiReasoning: result.aiReasoning,
      growthInfo: result.growthInfo,
      solutions: result.solutions || [],
      droneActions: result.droneActions || [],
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      classification: "Unknown",
      confidence: 0,
      explanation: "An error occurred while connecting to the AI service. Please check your connection and try again.",
      solutions: ["Check internet connection", "Try capturing the image again"],
      droneActions: []
    };
  }
};
