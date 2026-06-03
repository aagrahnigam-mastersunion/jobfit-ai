import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.2,
  },
})

export async function callGemini(prompt: string): Promise<unknown> {
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text)
  } catch {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text)
  }
}
