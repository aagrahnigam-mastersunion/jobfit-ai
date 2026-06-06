# JobFit AI — Stitch UI Generation Guide
## Material You Design System + Per-Screen Prompts

Paste the DESIGN.md into every Stitch prompt as your design reference.
Then use the individual screen prompts below to generate each screen.

---

# DESIGN.md

# Design System: JobFit AI
**Style:** Google Material You (Material Design 3)
**Platform:** Web (Desktop + Mobile responsive)
**Seed Color:** Indigo Blue

---

## 1. Visual Theme & Atmosphere

JobFit AI carries a **calm, intelligent, and trustworthy** atmosphere — the visual equivalent of a sharp career advisor. The aesthetic is rooted in Google's Material You philosophy: surfaces feel soft and layered, corners are generously rounded, and color adapts dynamically to feel personal rather than corporate.

The overall mood is **airy but purposeful** — generous whitespace prevents cognitive overload (job searching is already stressful), while structured information hierarchy keeps the user focused on what matters. Elevation is used expressively: important cards float slightly above the surface, creating a sense of depth without heaviness.

The design avoids sharp edges entirely. Everything from buttons to cards to input fields uses **large, pill-friendly radii**, making the interface feel approachable and modern. Color is used meaningfully — confidence tiers (HIGH/MEDIUM/LOW) each have their own tonal role in the palette, not just arbitrary traffic-light colors.

---

## 2. Color Palette & Roles

### Primary Palette (Indigo Tonal Family)
- **Deep Indigo Anchor (#3D5AFE)** — Primary actions, CTAs, active navigation states, key highlights
- **Soft Indigo Container (#E8EAFF)** — Primary container backgrounds, selected chip backgrounds, active card tints
- **On-Primary White (#FFFFFF)** — Text and icons on primary-colored surfaces
- **On-Primary-Container Deep Indigo (#001289)** — Text and icons inside primary containers

### Secondary Palette (Slate Blue)
- **Muted Slate (#5C6BC0)** — Secondary actions, supporting icons, subheadings
- **Pale Lavender Container (#E3E5F5)** — Secondary container fills, preference chip backgrounds
- **On-Secondary White (#FFFFFF)** — Text on secondary surfaces

### Tertiary Palette (Warm Teal — for accents)
- **Gentle Teal (#00897B)** — Positive reinforcement, "Pros" column accents, success states
- **Whisper Teal Container (#D4F0EC)** — Pros card backgrounds, success banners

### Confidence Tier Colors
- **Verdant High (#2E7D32)** — HIGH confidence badge text and icon
- **Fresh High Container (#E8F5E9)** — HIGH confidence card background
- **Amber Medium (#E65100)** — MEDIUM confidence badge text
- **Warm Medium Container (#FFF3E0)** — MEDIUM confidence card background
- **Alert Low (#C62828)** — LOW confidence badge text
- **Blush Low Container (#FFEBEE)** — LOW confidence card background

### Neutral Surface System
- **Pure Surface (#FFFBFE)** — Main page background, Material You surface baseline
- **Surface Variant Pebble (#E7E0EC)** — Dividers, inactive chip borders, subtle separators
- **Elevated Surface Cloud (#F7F2FA)** — Card backgrounds (tonal elevation level 1)
- **Elevated Surface Mist (#F3EDF7)** — Modal backgrounds, drawer backgrounds (elevation level 2)
- **Outline Smoke (#79747E)** — Input field borders, inactive icon color
- **Outline Variant Fog (#CAC4D0)** — Subtle borders, card outlines

### Text Hierarchy
- **On-Surface Ink (#1C1B1F)** — Primary body text, headings
- **On-Surface Variant Graphite (#49454F)** — Secondary text, labels, captions
- **Disabled Ash (#C4C7C5)** — Disabled states, placeholder text

---

## 3. Typography Rules

**Font Family:** Google Sans (Display, Text variants) with Roboto as fallback
- Loaded via Google Fonts: `Google Sans Display` for hero headings, `Google Sans Text` for body

**Heading Scale:**
- **Display Large (57sp):** Landing page hero headline only — Google Sans Display, weight 400, slightly negative letter-spacing (-0.25px)
- **Headline Large (32sp):** Page titles, major section headers — Google Sans Display, weight 400
- **Headline Medium (28sp):** Card titles, analysis report section headers — Google Sans Text, weight 400
- **Title Large (22sp):** Confidence tier label, navigation item labels when active — Google Sans Text, weight 500
- **Title Medium (16sp):** Card subtitles, form field labels — Google Sans Text, weight 500, slight letter-spacing (+0.15px)

**Body Scale:**
- **Body Large (16sp):** Primary reading text, JD input content, analysis summaries — Roboto, weight 400
- **Body Medium (14sp):** Secondary descriptions, card body text, preference labels — Roboto, weight 400
- **Body Small (12sp):** Captions, timestamps, metadata — Roboto, weight 400

**Label Scale:**
- **Label Large (14sp):** Button text — Google Sans Text, weight 500, letter-spacing +0.1px
- **Label Medium (12sp):** Badge text, chip labels — Google Sans Text, weight 500, letter-spacing +0.5px
- **Label Small (11sp):** Overline text, micro labels — Roboto, weight 500, letter-spacing +0.5px, all caps

---

## 4. Component Stylings

**Buttons:**
- *Filled Button (Primary CTA):* Pill-shaped (fully rounded, 20dp radius), Deep Indigo Anchor (#3D5AFE) fill, white label text, no border, subtle tonal ripple on hover, 40dp height, horizontal padding 24dp
- *Tonal Button (Secondary action):* Pill-shaped, Soft Indigo Container (#E8EAFF) fill, Deep Indigo text, used for "Analyse Another", "View History"
- *Outlined Button (Tertiary action):* Pill-shaped, transparent fill, Outline Smoke (#79747E) border (1dp), On-Surface Ink text, used for "Cancel", "Skip"
- *Text Button:* No background, no border, Deep Indigo Anchor text, used for inline links and subtle actions
- *FAB (Floating Action Button):* Large rounded square (16dp radius), Deep Indigo Anchor fill, white icon + label, elevated with medium shadow, used as primary CTA on dashboard

**Cards / Containers:**
- *Standard Card:* Generously rounded corners (12dp radius), Elevated Surface Cloud (#F7F2FA) background, whisper-soft 1dp elevation shadow (`box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`), no visible border
- *Filled Card (for gap items):* Same radius, Surface Variant Pebble (#E7E0EC) background, used for individual gap taxonomy cards
- *Outlined Card (for history items):* 12dp radius, white background, 1dp Outline Variant Fog (#CAC4D0) border, no shadow — creates a lighter feel for list items
- *Elevated Card (Confidence result):* 16dp radius, white background, medium elevation shadow (`box-shadow: 0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)`), left border accent 4dp in confidence tier color

**Input Fields / Forms:**
- *Filled Text Field (Material You style):* Rounded top corners (4dp top, flat bottom), Surface Variant Pebble (#E7E0EC) fill, no visible border until focused, Outline Smoke bottom line (1dp), label animates up on focus — used for JD input, search
- *Outlined Text Field:* Fully rounded (4dp all corners), white background, Outline Smoke (#79747E) border (1dp), Deep Indigo Anchor active border (2dp on focus) — used for settings fields, preference inputs
- *Large JD Textarea:* Same as outlined, but tall (min 200dp), body text size, subtle resize handle

**Chips:**
- *Filter Chip:* Pill-shaped (fully rounded), Elevated Surface Cloud background when unselected, Soft Indigo Container (#E8EAFF) when selected with checkmark icon, Label Medium typography, 32dp height
- *Assist Chip:* Pill-shaped, outlined style (Outline Variant Fog border), used for failure mode tags on gap cards
- *Input Chip:* Pill-shaped, Elevated Surface Cloud background, with remove (×) icon — used for skills tags

**Navigation:**
- *Navigation Rail (Desktop):* Left sidebar, 80dp wide, Pure Surface background, Deep Indigo active indicator (pill-shaped, 56dp wide × 32dp tall behind icon), active icon in Deep Indigo, inactive icons in On-Surface Variant Graphite, destination labels below icons
- *Navigation Bar (Mobile):* Bottom bar, Pure Surface background with subtle top shadow, same active indicator treatment, 4 destinations max
- *Top App Bar:* Transparent or Pure Surface, headline or title for current page, back button when in nested view, optional overflow menu

**Badges:**
- Confidence tier badges: Pill-shaped (fully rounded), confidence-specific container color fill, matching text color, Label Medium typography, 24dp height
- Failure mode badges: Assist Chip style, each mode has a distinct muted tonal color
- Severity badges: CRITICAL = Blush Low Container with Alert Low text, MODERATE = Warm Medium Container with Amber Medium text, NICE_TO_HAVE = Surface Variant with Graphite text

**Dividers:** 1dp height, Surface Variant Pebble (#E7E0EC) color, full width, used sparingly — prefer whitespace over dividers

---

## 5. Layout Principles

**Grid:** 4dp baseline grid throughout. Desktop uses a 12-column grid with 24dp gutters. Mobile uses a 4-column grid with 16dp gutters.

**Spacing Scale:** 4dp / 8dp / 12dp / 16dp / 24dp / 32dp / 48dp / 64dp — always multiples of 4

**Whitespace Philosophy:** Generous — Material You is never cramped. Cards have 16dp internal padding (24dp on desktop). Section gaps are at minimum 24dp. The layout breathes.

**Content Width:** Main content area maxes at 1200dp on desktop. Single-column layout on mobile. Two-column layout (sidebar + main) on desktop for analysis and dashboard pages.

**Elevation Strategy:** Three tiers — Background (0dp), Surface (1dp tonal elevation = slight tint), Card (3dp = Cloud background + subtle shadow), Modal/Drawer (6dp = Mist background + visible shadow). Never use dark drop shadows — always tonal (slightly colored, very soft).

**Sidebar Width (Desktop):** Navigation rail = 80dp collapsed, 240dp expanded. Content area sidebar (preferences) = 320dp fixed.

**Mobile Adaptations:** Navigation rail becomes bottom navigation bar. Two-column layouts become single column with collapsible panels. FAB moves to bottom-right corner.

---

# STITCH SCREEN PROMPTS

Use each prompt below in Stitch. Paste the full DESIGN.md above before each prompt, then add the screen-specific instructions.

---

## SCREEN 1 — Landing Page

```
Using the Material You design system described in the DESIGN.md above, create a landing page for JobFit AI — an AI-powered job application analyzer.

Page structure (top to bottom):
1. Top App Bar: JobFit AI logo (left), "Sign In" outlined pill button (right). Pure Surface background, no elevation.

2. Hero Section: Full-width, centered. Large display headline "Know Your Fit Before You Apply" in Google Sans Display. Subheading body text: "Upload your CV, paste a LinkedIn job description, and get an AI-powered Match Confidence score, Gap Analysis, and personalised recommendations in under 15 seconds." Two buttons side by side: filled pill "Get Started Free" (Deep Indigo Anchor) and tonal pill "See How It Works" (Soft Indigo Container). Soft illustrated background — abstract indigo tonal shapes, very low opacity.

3. Three Feature Cards: Horizontal row of 3 elevated cards (12dp radius, Cloud background). Card 1: indigo icon, "Match Confidence", "Get a LOW/MEDIUM/HIGH confidence rating with evidence from your CV and the JD". Card 2: teal icon, "Gap Taxonomy", "Every gap classified by failure mode — ATS keywords, seniority, experience framing, and more." Card 3: amber icon, "Preference-Weighted Pros & Cons", "Tell us what matters to you and we weight the analysis around your priorities."

4. How It Works: Section title "Three steps to clarity". Three horizontal steps with numbered filled circles in Deep Indigo: "1. Upload your CV", "2. Paste the job description", "3. Get your analysis". Clean, minimal, wide spacing.

5. Footer: Pure Surface, centered text, "JobFit AI · Built with Gemini AI".

Mobile responsive. Generous whitespace throughout. Material You tonal elevation, no harsh shadows.
```

---

## SCREEN 2 — Sign In Page

```
Using the Material You design system described in the DESIGN.md above, create a sign-in page for JobFit AI.

Page structure:
Centered card layout. Pure Surface page background. Single elevated card (16dp radius, white background, medium shadow) centered on page, max width 400dp, padding 32dp.

Inside the card:
- JobFit AI logo mark at top center (indigo rounded square icon)
- Headline Medium: "Sign in to JobFit AI"
- Body Medium subtitle in Graphite: "Analyse your job fit and track your applications"
- Generous spacing (32dp)
- Large filled button: Google icon (coloured) on left, "Continue with Google", pill-shaped, white background with Outline Variant Fog border, On-Surface Ink text, full width
- Spacing (24dp)
- Divider with "or" text in center (Graphite color)
- Spacing (24dp)
- Outlined text field: "Email address", full width
- Filled pill button below: "Send Magic Link", Deep Indigo Anchor fill, white text, full width
- Body Small text at bottom in Graphite: "By signing in you agree to our Terms of Service"

Page background: very subtle tonal indigo radial gradient at top center, extremely low opacity (5%). Otherwise Pure Surface.
```

---

## SCREEN 3 — Dashboard

```
Using the Material You design system described in the DESIGN.md above, create the main dashboard page for JobFit AI. Desktop layout with navigation rail on the left.

Navigation Rail (left, 80dp wide):
Icons for: Home (active, Deep Indigo pill indicator), Analyse, History, Settings. JobFit AI icon mark at top. Each destination has icon + label below.

Main Content Area:
Top: "Good morning, Aagrah" in Headline Large. Subtitle in Graphite: "Ready to analyse your next opportunity?"

CV Status Card (full width, elevated card, 12dp radius):
If CV uploaded: Soft Indigo Container (#E8EAFF) background, checkmark icon in Deep Indigo, "Your CV is ready" Title Medium, Body Medium in Graphite "Last updated 2 days ago", tonal pill button "Update CV" on right.
If no CV: Warm amber tonal background, upload icon, "Upload your CV to get started", filled pill button "Upload CV".

Show the "CV uploaded" state.

Large FAB (bottom right of content, not fixed): "Analyse a Job" with search icon, Deep Indigo Anchor fill, white text + icon, 16dp radius, medium elevation shadow.

Recent Analyses Section:
Title Large "Recent Analyses" with "View All" text button on right.
Three outlined cards (12dp radius, 1dp Outline Variant Fog border) in a vertical list:
Each card: company name + role title (Title Medium), date (Label Small Graphite), confidence badge (pill-shaped, appropriate tier color), brief 1-line summary (Body Small Graphite). Chevron right icon.
Cards: "Product Manager at Razorpay — HIGH confidence", "Software Engineer at Flipkart — MEDIUM confidence", "Growth Manager at Swiggy — LOW confidence".

Quick Stats Row: Three small tonal cards side by side. "12 Analyses", "3 HIGH confidence", "Avg. MEDIUM". Soft Indigo Container fill each.
```

---

## SCREEN 4 — Analyse Page (Input State)

```
Using the Material You design system described in the DESIGN.md above, create the Analyse page for JobFit AI — the state before analysis is run. Desktop layout with navigation rail.

Navigation Rail: Same as dashboard, "Analyse" destination active.

Two-column main layout:
Left column (wider, ~65%): JD Input
Right column (~35%): Preferences Panel

Left Column:
Headline Large "Analyse a Job"
Body Medium Graphite subtitle "Paste a LinkedIn job description to get your personalised match analysis"
Spacing 24dp
Large outlined textarea (full width, min height 280dp, 4dp radius, Outline Smoke border, Body Large text): placeholder text "Paste the job description here..." in Disabled Ash color
Below textarea: two outlined text fields side by side — "Job Title (optional)" and "Company (optional)", each 50% width, 4dp radius
Spacing 24dp
Large filled pill button "Analyse My Fit →" full width, Deep Indigo Anchor fill, white Label Large text, 56dp height

Right Column:
Elevated card (12dp radius, Cloud background, subtle shadow), padding 24dp
Title Medium "Your Preferences" with edit pencil icon button (text button)
Spacing 16dp
Preference rows with Label Medium + value chips:
"Role Type" → filled chip "Product"
"Seniority" → filled chip "Mid-level"  
"Work Style" → filled chip "Remote"
"Growth Priority" → filled chips "Learning" "Career Growth"
"Location" → filled chip "Bangalore / Remote"
All chips: Soft Indigo Container fill, Deep Indigo text, pill-shaped
Spacing 16dp
Text button "Edit Preferences →" in Deep Indigo at bottom
```

---

## SCREEN 5 — Analyse Page (Results State)

```
Using the Material You design system described in the DESIGN.md above, create the Analyse page results state for JobFit AI. This is shown after analysis completes. Desktop layout with navigation rail.

Navigation Rail: Same, "Analyse" active.

Full-width content (single column, max 800dp centered):

1. Confidence Card (prominent, elevated, 16dp radius):
Left accent border 4dp in Verdant High (#2E7D32). Fresh High Container (#E8F5E9) background. 
Left side: "Match Confidence" Label Medium Graphite, Large pill badge "HIGH" in Verdant High fill with white text (Title Large), bold. Below badge: "Strong alignment across skills, experience level, and role requirements" Body Medium.
Right side (in card): two stacked items: "Top Strength: 3+ years of product management in SaaS" with green checkmark icon. "Top Concern: No SQL mentioned in CV" with amber warning icon. Both Body Medium.

2. Gap Analysis Section:
Title Large "Gap Analysis" with subtitle Body Medium Graphite "3 gaps identified across your profile"
Spacing 16dp
Three filled cards (12dp radius, Surface Variant Pebble background, 16dp padding) stacked:

Gap Card 1 (CRITICAL): 
Top row: "Missing SQL Proficiency" Title Medium | "CRITICAL" badge (Blush Low Container, Alert Low text, pill) | "ATS_KEYWORD" assist chip (blue tonal) 
JD evidence blockquote: left border 3dp Deep Indigo, Soft Indigo Container background, italic Body Medium "...proficiency in SQL and data querying required..."
Three recommendations as Body Medium list with indigo arrow icons:
"Add SQL to your skills section with proficiency level"
"Complete a free SQL course on Mode Analytics or Khan Academy"  
"Add a project bullet mentioning SQL usage with quantified impact"

Gap Card 2 (MODERATE): Same structure, amber tonal treatment, "EXPERIENCE_FRAMING" chip

Gap Card 3 (NICE_TO_HAVE): Same structure, gray tonal treatment, "CERTIFICATION" chip

3. Pros & Cons Section:
Title Large "Pros & Cons"
Two-column grid, equal width:
Left "Pros" column header: Gentle Teal (#00897B) color, checkmark icon
Right "Cons" column header: Alert Low (#C62828) color, X icon
Each item: outlined card (8dp radius), Body Medium text, source chip (CV/PREFERENCE/JD), weight indicator dot (HIGH=filled, MEDIUM=half, LOW=empty)

4. Action Row at bottom:
Two buttons side by side: Tonal pill "Analyse Another Job" | Filled pill "Save to History"
```

---

## SCREEN 6 — History Page

```
Using the Material You design system described in the DESIGN.md above, create the Analysis History page for JobFit AI. Desktop layout with navigation rail.

Navigation Rail: Same, "History" destination active.

Main Content:
Headline Large "Analysis History"
Subtitle Body Medium Graphite "12 analyses · sorted by most recent"
Spacing 24dp

Search + filter row:
Outlined search field (pill-shaped, 48dp height, search icon left, "Search by role or company..." placeholder), ~50% width
Filter chips to the right: "All" (selected, Soft Indigo Container), "HIGH" (outlined), "MEDIUM" (outlined), "LOW" (outlined)

Spacing 24dp

Vertical list of outlined cards (12dp radius, 1dp Outline Variant Fog border, white background, 20dp padding):

Card layout (each):
Left: Company initial avatar circle (40dp, tonal indigo fill, white initial letter)
Center: Role title (Title Medium On-Surface Ink) + Company name (Body Medium Graphite) stacked. Below: Body Small Graphite "Analysed 2 days ago · 4 gaps identified"
Right: Confidence badge pill (appropriate tier color) + chevron right icon

Show 5 cards with varied confidence tiers:
1. "Product Manager" at Razorpay — HIGH
2. "Growth Lead" at CRED — HIGH  
3. "Software Engineer" at Flipkart — MEDIUM
4. "Strategy Manager" at Swiggy — MEDIUM
5. "Product Analyst" at Meesho — LOW

Subtle divider between each card (or use card spacing 8dp gap — prefer spacing over dividers)
```

---

## SCREEN 7 — Settings Page

```
Using the Material You design system described in the DESIGN.md above, create the Settings page for JobFit AI. Desktop layout with navigation rail.

Navigation Rail: Same, "Settings" destination active.

Two-column layout:
Left: Settings navigation list (240dp)
Right: Active settings content panel

Left Settings Nav:
Vertical list of tonal list items:
"Preferences" (active, Soft Indigo Container pill behind text, Deep Indigo text)
"CV & Skill Vector"
"Account"
Each item: 48dp height, 16dp left padding, Body Large text, appropriate icon left

Right Content Panel (Preferences section active):

Title Large "Job Preferences"
Body Medium Graphite "These preferences weight your analysis results"
Spacing 24dp

Preference Form (elevated card, 12dp radius, 24dp padding):

"Role Type" Label Large, spacing 8dp
Row of filter chips: "Engineering" "Product" (selected, Soft Indigo Container) "Design" "Marketing" "Sales" "Operations"

Spacing 20dp
"Preferred Seniority" Label Large
Single-select outlined chips in a row: "Junior" "Mid" (selected) "Senior" "Lead" "Manager"

Spacing 20dp
"Work Style" Label Large  
Radio-style chips: "Remote" (selected) "Hybrid" "On-site" "No preference"

Spacing 20dp
"Location Preference" Label Large
Outlined text field, value "Bangalore / Remote"

Spacing 20dp
"Growth Priorities" Label Large
Body Small Graphite "Drag to rank what matters most"
Four ranked chips in a column with drag handle icons: "1. Learning & Growth" "2. Compensation" "3. Career Progression" "4. Work-Life Balance"

Spacing 32dp
Filled pill button "Save Preferences" Deep Indigo Anchor, right-aligned
```

---

## SCREEN 8 — CV Upload / Skill Vector Screen (within Settings)

```
Using the Material You design system described in the DESIGN.md above, create the CV & Skill Vector settings panel for JobFit AI. Same two-column settings layout, "CV & Skill Vector" nav item active on left.

Right Content Panel:

Title Large "Your CV & Skill Vector"
Body Medium Graphite "We store an anonymised skill vector from your CV — never the raw file."
Spacing 24dp

Current Vector Card (elevated, 12dp radius, Soft Indigo Container background, 24dp padding):
Left: document icon (Deep Indigo, 40dp)
Center: "resume_aagrah_2026.pdf" Title Medium | "Skill vector created · Updated 3 days ago" Body Small Graphite | "87 skills extracted · 4 experience entries · 2 education entries" Body Small Graphite
Right: two icon buttons — "Re-parse" (refresh icon, tonal) and "Delete" (trash icon, outlined in Alert Low color)

Spacing 24dp

Extracted Skills Preview Card (outlined card, 12dp radius, 16dp padding):
Title Medium "Extracted Skills"
Spacing 12dp  
Wrap row of assist chips (pill-shaped, Surface Variant Pebble background, Graphite text): "Product Strategy" "Roadmapping" "SQL" "Python" "Figma" "Stakeholder Management" "A/B Testing" "Data Analysis" "User Research" "OKRs" + "and 77 more..." text button

Spacing 24dp

Upload New CV section:
Title Medium "Upload a new CV"
Body Medium Graphite "This will replace your current skill vector"
Spacing 16dp
Large dashed upload dropzone (12dp radius, Surface Variant Pebble background, Outline Variant Fog dashed border 2dp): centered upload icon (Graphite, 32dp) + "Drag & drop your CV here" Title Medium + "PDF or DOCX · Max 10MB" Body Small Graphite + tonal pill button "Browse Files"
```

---

# USAGE INSTRUCTIONS

1. Go to stitch.withgoogle.com
2. Create a new project called "JobFit AI"
3. For each screen, create a new screen in Stitch
4. Paste the DESIGN.md section (everything under "# Design System: JobFit AI") first
5. Then paste the individual screen prompt
6. Set device type to "Web" for desktop screens
7. Generate — if the output drifts from Material You, add: "Strictly follow Material Design 3 / Material You guidelines. Use Google Sans font, tonal color system, generous rounding."

## Recommended Generation Order
1. Screen 3 (Dashboard) — establishes the nav rail and layout system
2. Screen 5 (Results) — most complex, anchors the color system
3. Screen 4 (Analyse Input) — builds on layout from dashboard
4. Screen 6 (History) — simpler, reuses card patterns
5. Screen 7 (Settings) — reuses layout + form patterns
6. Screen 1 (Landing) — standalone, different layout
7. Screen 2 (Sign In) — simplest, last
8. Screen 8 (CV Upload) — extends settings screen
