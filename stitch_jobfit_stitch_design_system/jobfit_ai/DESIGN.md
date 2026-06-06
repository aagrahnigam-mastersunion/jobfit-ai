---
name: JobFit AI
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f5'
  surface-container: '#f0edf0'
  surface-container-high: '#ebe7ea'
  surface-container-highest: '#e5e1e4'
  on-surface: '#1c1b1d'
  on-surface-variant: '#444656'
  inverse-surface: '#313032'
  inverse-on-surface: '#f3f0f3'
  outline: '#79747E'
  outline-variant: '#CAC4D0'
  surface-tint: '#2848ee'
  primary: '#183ce6'
  on-primary: '#ffffff'
  primary-container: '#E8EAFF'
  on-primary-container: '#001289'
  inverse-primary: '#bbc3ff'
  secondary: '#4858ab'
  on-secondary: '#ffffff'
  secondary-container: '#E3E5F5'
  on-secondary-container: '#27378a'
  tertiary: '#006157'
  on-tertiary: '#ffffff'
  tertiary-container: '#007c6f'
  on-tertiary-container: '#bbfff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000f5d'
  on-primary-fixed-variant: '#002ccd'
  secondary-fixed: '#dee0ff'
  secondary-fixed-dim: '#bac3ff'
  on-secondary-fixed: '#00105b'
  on-secondary-fixed-variant: '#2f3f92'
  tertiary-fixed: '#8df5e4'
  tertiary-fixed-dim: '#70d8c8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#fcf8fb'
  on-background: '#1c1b1d'
  surface-variant: '#E7E0EC'
  success-container: '#D4F0EC'
  high-confidence: '#2E7D32'
  high-confidence-container: '#E8F5E9'
  medium-confidence: '#E65100'
  medium-confidence-container: '#FFF3E0'
  low-confidence: '#C62828'
  low-confidence-container: '#FFEBEE'
  elevated-surface-1: '#F7F2FA'
  elevated-surface-2: '#F3EDF7'
typography:
  display-lg:
    fontFamily: Source Sans 3
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Source Sans 3
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: Source Sans 3
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  title-lg:
    fontFamily: Source Sans 3
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  gutter-desktop: 24px
  margin-desktop: auto
  gutter-mobile: 16px
  margin-mobile: 16px
---

## Brand & Style

The design system is built upon the principles of **Material Design 3 (Material You)**, tailored specifically for an AI-driven career advisor. The brand personality is **calm, intelligent, and trustworthy**, designed to evoke a sense of clarity and purpose for users navigating career transitions.

The visual style is **Corporate / Modern**, characterized by an "airy" atmosphere that utilizes generous whitespace and tonal layering to reduce cognitive load. The aesthetic avoids harsh contrasts, favoring a harmonious relationship between surfaces and their content. Every interaction is designed to feel purposeful, leveraging soft geometry and a systematic color language to provide an experience that is both sophisticated and approachable.

## Colors

The color system utilizes a **Tonal Palette** approach where colors are derived from a seed indigo to ensure harmony. 

- **Primary & Containers:** The Deep Indigo Anchor serves as the primary driver for actions, while the Soft Indigo Container provides a low-stress background for active elements.
- **Functional Tiers:** Confidence levels are communicated through a "Traffic Light" system that has been softened for a professional environment:
    - **High Confidence (Verdant):** Used for strong job matches.
    - **Medium Confidence (Amber):** Indicates areas for potential growth or partial matches.
    - **Low Confidence (Alert):** Highlights significant gaps in fit.
- **Surface Strategy:** Backgrounds transition from Pure Surface (#FFFBFE) to slightly tinted "Cloud" and "Mist" surfaces as elevation increases, rather than relying on heavy shadows.

## Typography

The typography system uses **Source Sans 3** (as a high-quality substitute for Google Sans) for all display, headline, and title roles to project a modern, friendly, and geometric brand voice. **Roboto Flex** is used for body text and labels to ensure maximum legibility and utilitarian precision in data-heavy career summaries.

Hierarchy is maintained through careful weight distribution:
- **Headlines:** Clean and light (400) for a modern, airy feel.
- **Titles & Labels:** Medium (500) weights are used to provide clear structure and call-to-action visibility.
- **Body:** Standard weight (400) optimized for long-form reading of job descriptions.

## Layout & Spacing

This design system adheres to a **fixed-width grid** on desktop and a **fluid grid** on mobile.

- **Desktop (Breakpoint 1200px+):** A 12-column grid with a maximum container width of 1200px. Gutters are fixed at 24px.
- **Mobile (Breakpoint 0-599px):** A 4-column fluid grid with 16px margins and 16px gutters.
- **Spacing Rhythm:** All spatial relationships are built on a 4px baseline grid. Components should primarily use 16px (lg) and 24px (xl) increments for internal padding and section gaps to maintain the "airy" feel.

## Elevation & Depth

In alignment with Material Design 3, elevation is primarily expressed through **Tonal Layers** rather than heavy drop shadows. 

- **Surface Levels:** 
    - **Level 0:** Pure Surface (#FFFBFE).
    - **Level 1:** Elevated Surface Cloud (#F7F2FA) for subtle card groupings.
    - **Level 2:** Elevated Surface Mist (#F3EDF7) for interactive elements like drawers and modals.
- **Shadows:** When used, shadows are extremely soft and diffuse. Level 2 cards use a dual-layer shadow (8% and 6% opacity) to feel anchored but light. 
- **Confidence Highlighting:** Results-based cards utilize a slightly more pronounced shadow (12% and 8%) to draw the user's focus toward AI-generated insights.

## Shapes

The shape language is defined by two primary styles:
- **Pill-Shape:** Used for interactive elements that require high affordance, such as Buttons, Chips, and Search Bars. These use a minimum radius of 20px to create a soft, friendly touch target.
- **Rounded Rectangles:** Used for structural elements. Standard Cards use a 12px radius, while larger containers like Floating Action Buttons (FABs) and Page Sheets use a 16px radius.
- **Inputs:** Text fields use a 4px radius on the top corners (for filled versions) to maintain a grounded, professional appearance.

## Components

- **Buttons:** All buttons must be **pill-shaped**. Primary buttons use the Deep Indigo Anchor with white text. Tonal buttons use the Soft Indigo container with the On-Primary-Container text.
- **Cards:** Use a 12px corner radius. For Confidence cards, incorporate a **4px left-accent border** in the respective tier color (Verdant, Amber, or Alert) to provide immediate visual categorization without overwhelming the user.
- **Text Fields:** Follow the Material Design "Filled" or "Outlined" styles. Filled fields should use the Pebble (#E7E0EC) background.
- **Chips:** Strictly pill-shaped at 32px height. Use for job categories, skills, and status filters.
- **Navigation Rail (Desktop):** A vertical rail (80px to 240px wide) featuring a 56x32px pill-shaped active indicator behind the active icon.
- **Bottom Bar (Mobile):** A standard navigation bar for top-level destinations, keeping actions within thumb-reach.
- **FAB:** A 56px tall button with a 16px radius, reserved for the primary AI action (e.g., "Analyze Resume").