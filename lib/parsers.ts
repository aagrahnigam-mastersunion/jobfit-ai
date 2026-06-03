export async function parsePDF(buffer: Buffer): Promise<string> {
  // Import the inner module directly — avoids Next.js loading pdf-parse's
  // test-runner code AND avoids the DOMMatrix issue in pdf-parse v2.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (
    buf: Buffer
  ) => Promise<{ text: string }>
  const data = await pdfParse(buffer)
  return data.text
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function parseFile(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.pdf') || mimeType === 'application/pdf') {
    return parsePDF(buffer)
  }
  if (
    lower.endsWith('.docx') ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return parseDOCX(buffer)
  }
  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
}
