
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
      contents: `Com base no conteúdo da legenda SRT a seguir, gere 4 prompts de imagem distintos e detalhados. Cada prompt deve descrever uma cena adequada para uma fotografia autêntica, granulada e em preto e branco da era da Primeira ou Segunda Guerra Mundial. Os prompts devem evocar um senso de história, drama e o período de tempo específico.

      Conteúdo SRT:
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
                description: "Um prompt detalhado para geração de imagem.",
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
    console.error("Erro ao gerar prompts:", error);
    throw new Error("Falha ao gerar prompts a partir do conteúdo SRT.");
  }
};

/**
 * Generates an image from a given prompt.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to a base64 encoded image URL.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `${prompt}, fotografia autêntica em preto e branco, estilo Primeira Guerra Mundial, granulada, alto contraste, iluminação dramática, foto histórica, estética dos anos 1940.`;
    
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
    throw new Error("Nenhuma imagem foi gerada.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error(`Falha ao gerar imagem para o prompt: "${prompt}"`);
  }
};
