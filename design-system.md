# Kalebia Nyoue Franck — Design System & Creative Direction

This is the single source of truth for every section built after the hero.
Reference it before building anything new — don't reinvent spacing, type,
or motion per-section.

---

## 1. Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF7` | Base background, everywhere |
| `--ink` | `#111114` | Primary text, primary buttons |
| `--accent` | `#C9A24B` | Gold — emphasis words, dividers, hover states, eyebrow labels |
| `--ink/55` | `rgba(17,17,20,.55)` | Body copy |
| `--ink/30–40` | | Metadata, timestamps, muted labels |
| `--ink/06–10` | | Hairline borders, dividers |

No new saturated colors, ever. Accent is used sparingly — 1–2 words per
section, never a filled background.

## 2. Typography

Two fonts, same as the hero:

- **Display**: `Fraunces` (variable, opsz 9–144, weight 300–600) — every
  headline, every huge number, every oversized decorative word.
- **Body/UI**: `Inter` (300–600) — paragraphs, nav, labels, metadata.

**Scale principle**: typography *is* the layout. Sections don't get boxed
headings — they get one dominant type element (a sentence, a number, a
word) that occupies real spatial territory, with small supporting text
wrapped around it. Mix a light-weight large line with a heavier
medium-large line for rhythm, the way the hero headline does.

**Numbers as hero elements** (Impact, project metrics, section counters):
use `clamp()` display sizes large enough to dominate a viewport, `Fraunces`
light weight, never boxed in a card.

## 3. Spacing & Grid

- Outer page padding: `px-8 lg:px-16`, max content width `1600px`.
- Sections default to a **12-column grid** (`lg:grid-cols-12`) but content
  should occupy asymmetric spans (5/7, 4/8, 7/5 — never a lazy 6/6) to
  avoid the "two equal boxes" SaaS feeling.
- Vertical rhythm between sections: generous, `py-24` to `py-40` depending
  on section weight. Let whitespace read as intentional, not empty.
- Section index markers (`01 —`, `02 —`) in `text-[11px] tracking-[0.3em]
  text-ink/30` — used as a recurring editorial device across sections,
  established in the hero.

## 4. Motion Language

One shared vocabulary, reused everywhere — never introduce a new easing
curve or animation idiom per section.

- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` — the only easing curve
  used site-wide, for consistency ("premium" reads as *restrained and
  repeated*, not varied).
- **Reveal-on-scroll**: elements fade up (`translateY(28px) → 0`,
  opacity `0 → 1`) as they enter viewport, via `IntersectionObserver`
  (component: `Reveal`, see §6). Stagger children 100–140ms apart.
- **Headline line-reveal**: clipped upward slide per line (`.reveal-line`
  pattern from the hero) — reused for any large editorial sentence.
- **Parallax**: subtle only. Mouse-driven on hero/portrait-adjacent
  elements; scroll-driven (`translateY` tied to `scrollY * small factor`)
  on decorative ghost typography.
- **Hover**: underline-grow (`scale-x-0 → 100` on a thin accent line),
  magnetic buttons (cursor-relative translate, capped ~±10px), light-sweep
  on solid buttons. No bounce, no spring overshoot.

## 5. Interaction Principles

- **No icon libraries.** Typography, numerals, and thin geometric lines
  (hairline dividers, `/`, `—`) do the work icons would normally do.
- **No cards-as-default.** Before reaching for a bordered rounded box,
  ask whether the content can instead be a typographic composition
  (oversized number, wrapped sentence, editorial spread).
- **No two equally-weighted CTAs** in a section — one dominant action +
  one quiet text link, matching the hero pattern.
- **Glass is a garnish, not a base.** `backdrop-blur` + low-opacity white
  + hairline border, reserved for: nav, small floating labels/chips,
  constellation nodes (Platforms section), never a full section
  background.

## 6. Shared Components (build once, reuse)

To keep sections consistent, extract these from the hero into
`src/components/`:

- `Reveal.tsx` — scroll-triggered fade-up wrapper (IntersectionObserver),
  replaces the hero's mount-only `fade-up` for below-the-fold sections.
- `SectionMarker.tsx` — the `01 — LABEL` editorial index device.
- `MagneticButton.tsx` — generalized version of the hero's
  `MagneticPrimary`, accepts `variant: "solid" | "outline"`.
- `EditorialLink.tsx` — the quiet underline-arrow link, already built.
- `GhostType.tsx` — oversized low-opacity background word(s), generalized
  from the hero's `DECORATIVE_WORDS` pattern, reusable per-section with
  different word sets.

## 7. Section-to-Pattern Mapping

Quick reference for what each remaining section becomes, in this system:

| Section | Pattern |
|---|---|
| Editorial Intro (À propos) | One massive wrapped sentence + small supporting copy, portrait continuation |
| Expertise + Skills | Split-screen 50/50, two massive headings, scroll-reveal capability lists, no icons |
| Plateformes | Interactive constellation — floating glass nodes, hover reveals stats |
| Réalisations | Full-bleed editorial chapters per project, one giant metric as layout anchor, no two projects share a composition |
| Formations | Premium "magazine cover" treatment, large type, minimal metadata |
| Blog | Editorial journal grid — one featured + secondary grid, hover preview image |
| Impact | Kinetic oversized numbers, one per viewport-scroll-beat |
| Méthode | Vertical timeline, large numerals, connecting line, scroll-fade steps |
| Témoignages | Interview layout — huge quote marks, serif type, portrait + signature |
| Partenaires | Infinite marquee, monochrome → color on hover |
| Contact | Cinematic full-viewport close, oversized headline, quiet contact details, signature instead of footer |

---

**Rule going forward**: every new section gets built *against* this
document, not invented fresh. If a section seems to need a new color,
font, easing curve, or interaction idiom — that's a signal to find the
existing pattern that already covers it, rather than add one.
