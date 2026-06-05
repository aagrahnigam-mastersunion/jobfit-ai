export type ConfidenceTier = 'LOW' | 'MEDIUM' | 'HIGH'
export type FailureMode =
  | 'ATS_KEYWORD'
  | 'EXPERIENCE_FRAMING'
  | 'SENIORITY_MISMATCH'
  | 'LOCATION'
  | 'COMPETITION'
  | 'EDUCATION'
  | 'CERTIFICATION'
export type Severity = 'CRITICAL' | 'MODERATE' | 'NICE_TO_HAVE'
export type WeightTier = 'HIGH' | 'MEDIUM' | 'LOW'

export interface SkillEntry {
  name: string
  proficiency: 'beginner' | 'intermediate' | 'advanced'
  years: number | null
}

export interface ExperienceEntry {
  title: string
  company: string
  domain: string
  years: number
  impact_keywords: string[]
}

export interface EducationEntry {
  degree: string
  field: string
  institution: string
}

export interface ProjectEntry {
  name: string
  domain: string
  tech_stack: string[]
  impact: string
}

export interface SkillVector {
  skills: SkillEntry[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  certifications: string[]
  projects: ProjectEntry[]
  languages: string[]
  summary: string
}

export interface Phase1Result {
  confidence: ConfidenceTier
  summary: string
  top_strength: string
  top_concern: string
  confidence_factors: string[]
  latency?: number
}

export interface Gap {
  gap: string
  failure_mode: FailureMode
  severity: Severity
  jd_evidence: string
  recommendations: string[]
}

export interface Pro {
  point: string
  source: 'CV' | 'PREFERENCE'
  weight: WeightTier
}

export interface Con {
  point: string
  source: 'JD' | 'PREFERENCE'
  weight: WeightTier
}

export interface PreferenceAlignment {
  aligned: string[]
  misaligned: string[]
}

export interface Phase2Result {
  gaps: Gap[]
  pros: Pro[]
  cons: Con[]
  preference_alignment: PreferenceAlignment
}

export interface CombinedAnalysisResult {
  confidence: ConfidenceTier
  summary: string
  top_strength: string
  top_concern: string
  confidence_factors: string[]
  gaps: Gap[]
  pros: Pro[]
  cons: Con[]
  preference_alignment: PreferenceAlignment
}

export interface UserPreferences {
  roleTypes: string[]
  seniority: string
  location: string
  workStyle: 'Remote' | 'Hybrid' | 'On-site' | 'No preference'
  growthPriorities: string[]
}

export interface Analysis {
  id: string
  user_id: string
  vector_id: string | null
  jd_title: string | null
  jd_company: string | null
  jd_raw: string
  jd_parsed: unknown
  confidence: ConfidenceTier | null
  summary: string | null
  gaps: Gap[]
  pros: Pro[]
  cons: Con[]
  recommendations: unknown[]
  preferences_snapshot: UserPreferences | null
  latency_phase1_ms: number | null
  latency_phase2_ms: number | null
  parent_analysis_id: string | null
  created_at: string
}

export interface SkillVectorRow {
  id: string
  user_id: string
  vector_data: SkillVector
  source_filename: string | null
  version: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  name: string | null
  preferences: UserPreferences | Record<string, never>
  created_at: string
  updated_at: string
}

export interface SSEEvent {
  type: 'confidence' | 'gaps' | 'pros_cons' | 'done' | 'error'
  data: unknown
}
