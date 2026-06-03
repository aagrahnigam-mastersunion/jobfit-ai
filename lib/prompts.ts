import type { SkillVector, UserPreferences, Phase1Result } from './types'

export function buildCVParsingPrompt(cvText: string): string {
  return `You are a CV parser. Extract structured data from the following CV text.
Output ONLY valid JSON matching the schema below. No markdown, no preamble, no explanation.
Do NOT infer or hallucinate any information not explicitly stated in the text.

Schema:
{
  "skills": [{ "name": "string", "proficiency": "beginner|intermediate|advanced", "years": number|null }],
  "experience": [{ "title": "string", "company": "string", "domain": "string", "years": number, "impact_keywords": ["string"] }],
  "education": [{ "degree": "string", "field": "string", "institution": "string" }],
  "certifications": ["string"],
  "projects": [{ "name": "string", "domain": "string", "tech_stack": ["string"], "impact": "string" }],
  "languages": ["string"],
  "summary": "string (2-3 sentence professional summary)"
}

CV TEXT:
${cvText}`
}

export function buildConfidencePrompt(
  vector: SkillVector,
  jdText: string,
  preferences: UserPreferences
): string {
  return `You are a job-fit analyst. Given a candidate's skill vector and a job description, determine the match confidence.
Rules:
- Output ONLY valid JSON. No markdown, no preamble.
- Confidence tiers: LOW (poor fit, major gaps), MEDIUM (partial fit, some gaps), HIGH (strong fit, minor or no gaps).
- Every factor must reference specific content from the skill vector or JD.
- If uncertain between two tiers, default to the lower one.
- Consider user preferences when weighing factors.

Schema:
{
  "confidence": "LOW" | "MEDIUM" | "HIGH",
  "summary": "string (1-2 sentences explaining the rating)",
  "top_strength": "string (the single strongest match point)",
  "top_concern": "string (the single biggest gap or risk)",
  "confidence_factors": ["string", "string", "string"]
}

SKILL VECTOR:
${JSON.stringify(vector, null, 2)}

JOB DESCRIPTION:
${jdText}

USER PREFERENCES:
${JSON.stringify(preferences, null, 2)}`
}

export function buildFullReportPrompt(
  vector: SkillVector,
  jdText: string,
  preferences: UserPreferences,
  phase1: Phase1Result
): string {
  return `You are a senior career analyst. Generate a detailed job-fit report.
Rules:
- Output ONLY valid JSON. No markdown, no preamble.
- Every gap MUST have jd_evidence: a quoted phrase directly from the JD.
- Failure modes: ATS_KEYWORD, EXPERIENCE_FRAMING, SENIORITY_MISMATCH, LOCATION, COMPETITION, EDUCATION, CERTIFICATION.
- Pros and Cons MUST be weighted by user preferences.
- Recommendations must be specific and actionable — never say "improve your skills".
- Never claim skills or experience not in the skill vector.
- Include 3-7 gaps, 3-6 pros, 3-6 cons, exactly 3 recommendations per gap.

Schema:
{
  "gaps": [{
    "gap": "string",
    "failure_mode": "ATS_KEYWORD|EXPERIENCE_FRAMING|SENIORITY_MISMATCH|LOCATION|COMPETITION|EDUCATION|CERTIFICATION",
    "severity": "CRITICAL|MODERATE|NICE_TO_HAVE",
    "jd_evidence": "string (quoted from JD)",
    "recommendations": ["string", "string", "string"]
  }],
  "pros": [{ "point": "string", "source": "CV|PREFERENCE", "weight": "HIGH|MEDIUM|LOW" }],
  "cons": [{ "point": "string", "source": "JD|PREFERENCE", "weight": "HIGH|MEDIUM|LOW" }],
  "preference_alignment": {
    "aligned": ["string"],
    "misaligned": ["string"]
  }
}

SKILL VECTOR:
${JSON.stringify(vector, null, 2)}

JOB DESCRIPTION:
${jdText}

USER PREFERENCES:
${JSON.stringify(preferences, null, 2)}

PHASE 1 RESULT:
${JSON.stringify(phase1, null, 2)}`
}
