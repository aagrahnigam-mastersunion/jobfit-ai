export async function parsePDF(buffer: Buffer): Promise<string> {
  // pdf-parse v2 uses a class-based API: new PDFParse({ data: buffer }).getText()
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFParse } = require('pdf-parse') as {
    PDFParse: new (opts: { data: Buffer }) => { getText(): Promise<{ text: string }> }
  }
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  return result.text
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export async function parseFile(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
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
