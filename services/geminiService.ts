
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates image prompts from SRT content.
 * @param srtContent The content of the SRT file.
 * @returns A promise that resolves to an array of prompt strings.
 */
export const generatePromptsFromSrt = async (srtContent: string): Promise<string[]> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following SRT subtitle content, generate 4 distinct and detailed image prompts. Each prompt must describe a scene suitable for an authentic, grainy, black and white photograph from the World War I or World War II era. The prompts should evoke a sense of history, drama, and the specific time period.

      SRT Content:
      ---
      ${srtContent}
      ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A detailed prompt for image generation.",
              },
            },
          },
          required: ["prompts"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.prompts && Array.isArray(jsonResponse.prompts)) {
      return jsonResponse.prompts;
    }
    return [];
  } catch (error) {
    console.error("Error generating prompts:", error);
    throw new Error("Failed to generate prompts from SRT content.");
  }
};

/**
 * Generates an image from a given prompt.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to a base64 encoded image URL.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `${prompt}, authentic black and white photograph, World War I style, grainy, high contrast, dramatic lighting, historical photo, 1940s aesthetic.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image for prompt: "${prompt}"`);
  }
};
