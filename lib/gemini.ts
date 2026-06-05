import OpenAI from 'openai'

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  }
  return _client
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const start = text.search(/[\[{]/)
  if (start !== -1) return text.slice(start)
  return text.trim()
}

export async function callLLM(prompt: string): Promise<unknown> {
  const makeRequest = async (): Promise<string> => {
    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a precise JSON API. Always respond with valid JSON only — no markdown, no code fences, no explanation. Output must be parseable by JSON.parse().',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 6000,
    })
    return response.choices[0]?.message?.content ?? ''
  }

  let text = await makeRequest()
  let parsed: unknown

  try {
    parsed = JSON.parse(extractJSON(text))
  } catch {
    text = await makeRequest()
    parsed = JSON.parse(extractJSON(text))
  }

  return parsed
}

export { callLLM as callGemini }
