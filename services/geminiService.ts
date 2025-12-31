import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";
import { DAYS, DAY_LABELS } from "../constants";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSchedule = async (courses: Course[]): Promise<any> => {
  const ai = getAIClient();
  if (!ai) {
    throw new Error("請先設定 Gemini API Key");
  }

  // Format schedule for the prompt
  const scheduleDescription = courses.map(c => 
    `- ${c.name} (${c.location || '無地點'}): ${DAY_LABELS[c.day]} ${c.startTime} 到 ${c.endTime}`
  ).join('\n');

  const prompt = `
    你是一位專業的大學學術顧問與時間管理專家。請分析以下這份課表：
    
    ${scheduleDescription}

    請提供 JSON 格式的回應，包含以下欄位：
    1. summary (string): 對這份課表的整體難度與結構的簡短總結 (繁體中文)。
    2. heavyDays (array of strings): 哪些天數的負擔最重？
    3. gaps (array of strings): 有哪些天有尷尬的空堂時間需要注意？
    4. advice (array of strings): 3-5 條具體的學習建議或時間管理技巧 (繁體中文)。

    如果課表是空的，請幽默地回應。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            heavyDays: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.ARRAY, items: { type: Type.STRING } },
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("無法分析課表，請稍後再試。");
  }
};
