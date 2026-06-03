import OpenAI from 'openai'

// Lazily created so the build doesn't fail when NVIDIA_API_KEY isn't set
let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY!,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    })
  }
  return _client
}

/**
 * Extract the first JSON object or array from a string.
 * Gemma sometimes wraps output in markdown code fences — this strips them.
 */
function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const start = text.search(/[\[{]/)
  if (start !== -1) return text.slice(start)
  return text.trim()
}

export async function callGemini(prompt: string): Promise<unknown> {
  const makeRequest = async (): Promise<string> => {
    const response = await getClient().chat.completions.create({
      model: 'google/gemma-3n-e4b-it',
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
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 8192,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    return response.choices[0]?.message?.content ?? ''
  }

  let text = await makeRequest()
  let parsed: unknown

  try {
    parsed = JSON.parse(extractJSON(text))
  } catch {
    // Retry once on parse failure
    text = await makeRequest()
    parsed = JSON.parse(extractJSON(text))
  }

  return parsed
}
