# Mobile UX Review Report

**Viewport:** 375×812 (iPhone 14/13/12 size)  
**Date:** March 11, 2026  
**Site:** http://localhost:4321

---

## Executive Summary

The site has solid responsive foundations: grids collapse to single column, most typography scales appropriately, and the hero stacks correctly. However, **the mobile menu is broken** (hamburger does not reveal navigation), and several touch targets and form inputs need refinement for better mobile usability.

---

## Critical Issues

### 1. **Mobile navigation menu does not open**

**Component:** `Header.astro`  
**Location:** All pages

**Problem:** The hamburger button toggles `header__nav--open` and `header__utility--open` but there are **no CSS rules** for these classes. The nav and utility stay `display: none` at 960px and below, so tapping the hamburger has no visible effect. Users cannot access page navigation on mobile.

**Fix:** Add CSS rules inside the `@media (max-width: 960px)` block to show the nav and utility when the open classes are present:

```css
@media (max-width: 960px) {
  .header__nav,
  .header__utility {
    display: none;
  }

  .header__nav.header__nav--open,
  .header__utility.header__utility--open {
    display: flex;
  }

  /* When open, show as full-width overlay or dropdown below header */
  .header__inner {
    flex-wrap: wrap;
  }

  .header__nav.header__nav--open {
    order: 3;
    width: 100%;
    flex-direction: column;
    padding-block: var(--sp-6);
    border-top: 1px solid var(--color-line);
  }

  .header__utility.header__utility--open {
    order: 4;
    width: 100%;
    flex-direction: column;
    padding-block: var(--sp-4);
    border-top: 1px solid var(--color-line);
  }

  .header__links {
    flex-direction: column;
    gap: var(--sp-4);
  }

  .header__mobile-toggle {
    display: block;
  }
}
```

Also ensure the mobile menu is positioned correctly (e.g., below the header bar) and that it closes when a link is tapped.

---

### 2. **Hamburger touch target is too small**

**Component:** `Header.astro`  
**Location:** All pages

**Problem:** The hamburger button has `padding: var(--sp-2)` (8px), and the icon is 1.25rem (20px). Total tap area is ~36×36px. Apple HIG recommends at least **44×44px** for touch targets.

**Fix:** Increase touch target size:

```css
.header__mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--sp-3);  /* 12px → 16px total */
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Moderate Issues

### 3. **Text-link buttons have undersized touch targets**

**Component:** `Button.astro` (variant `text`)  
**Location:** Feature cards, writing surface cards, essay list

**Problem:** The `btn--text` variant has `padding: 0.25rem 0` (4px vertical). That yields a very small touch area. Links like "Read More →", "Visit →", "Browse Essays" are hard to tap.

**Fix:** Add minimum touch target for text variant on mobile:

```css
@media (max-width: 768px) {
  .btn--text {
    padding: 0.5rem 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}
```

---

### 4. **Form inputs may not be full width on narrow viewports**

**Component:** `contact.astro`  
**Location:** Contact page

**Problem:** Form inputs use `padding` but no explicit `width`. In flex containers they can stretch, but some browsers or edge cases may not render them at full width. The form has `max-width: 36rem` but no `width: 100%`.

**Fix:** Ensure inputs and select are full width:

```css
.form__input,
.form__select,
.form__textarea {
  width: 100%;
  box-sizing: border-box;
  /* ... other styles */
}
```

---

### 5. **Resume metric highlights: 2×2 grid may be cramped on 375px**

**Component:** `ResumeHighlights.astro`  
**Location:** Resume page

**Problem:** At 768px and below, the grid becomes `repeat(2, 1fr)`. On 375px width with 24px gutters each side, each cell is ~163px. The metric text (2.5rem) and labels can feel tight.

**Fix:** Consider either:
- Stack to single column on very narrow viewports (e.g. `max-width: 480px`), or
- Slightly reduce metric font size on mobile: `font-size: 2rem` or `clamp(1.75rem, 5vw, 2.5rem)`.

---

### 6. **Direct contact links may wrap awkwardly**

**Component:** `contact.astro` (`.direct__links`)  
**Location:** Contact page

**Problem:** `.direct__links` uses `display: flex` with `gap: var(--sp-6)`. On 375px, "Email", "LinkedIn", "GitHub" may fit on one line, but if they wrap, they could stack or look uneven.

**Fix:** Add `flex-wrap: wrap` and ensure adequate spacing:

```css
.direct__links {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
}
```

---

## Minor Issues

### 7. **Associated properties cards: no mobile-specific layout**

**Component:** `AssociatedProperties.astro`  
**Location:** Homepage

**Problem:** The three cards (AfterFiat, Eschatology Report, AlchemicalAI) use `display: flex` with `gap: var(--sp-6)` and `flex-wrap: wrap`. On 375px they may wrap to 2+1 or 1+1+1 depending on content. No explicit single-column stacking.

**Fix:** Add a media query for consistent single-column layout on mobile:

```css
@media (max-width: 768px) {
  .associated__grid {
    flex-direction: column;
  }

  .associated__card {
    width: 100%;
  }
}
```

---

### 8. **Case study meta grid: `minmax(14rem, 1fr)` may be tight**

**Component:** `CaseStudyList.astro`  
**Location:** Work page

**Problem:** `.case-study__meta` uses `grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))`. On 375px width with gutters, 14rem (224px) forces a single column. Fine, but the gap between Role/Constraints/Outcomes might feel cramped.

**Fix:** Optional: reduce `minmax` to `12rem` on mobile so two columns could fit when space allows, or keep as-is if single column is preferred.

---

### 9. **CTA band buttons: wrap behavior**

**Component:** `CallToActionBand.astro`  
**Location:** All pages

**Problem:** The CTA band uses `flex-wrap: wrap` and `justify-content: center`. On 375px, "View Work" and "View Research" may fit side by side, but "Contact" could wrap. Behavior is acceptable; no critical fix needed.

**Status:** Acceptable; buttons wrap if needed.

---

## What Works Well

| Area | Status |
|------|--------|
| **Hero stacking** | Hero content and SVG stack vertically on mobile; SVG appears first (`order: -1`) |
| **Proof bar** | 3 columns → 1 column with proper borders |
| **Feature grid** | 2 columns → 1 column with full-width cards |
| **Capability grid** | 2×2 → 1 column |
| **Focus grid** | 3 columns → 1 column |
| **Principles grid** | 3 columns → 1 column |
| **Toolchain tags** | 2 columns → 1 column |
| **Research interests** | 2 columns → 1 column |
| **Writing surfaces** | 3 columns → 1 column |
| **Footer** | 3 columns → 1 column |
| **Typography** | Page hero scales h1 to h2 on mobile; body text is readable |
| **Spacing** | Container padding is consistent; sections use `padding-block` |
| **Header wordmark** | Displays correctly |
| **Primary/secondary buttons** | Adequate padding (0.75rem 1.5rem) for touch targets |

---

## Page-by-Page Summary

| Page | Critical | Moderate | Minor |
|------|----------|----------|-------|
| Homepage | Menu broken | Text-link touch targets | Associated cards layout |
| About | Menu broken | — | — |
| Work | Menu broken | Text-link touch targets | Case study meta |
| Writing | Menu broken | Text-link touch targets | — |
| Research | Menu broken | — | — |
| Resume | Menu broken | — | — |
| Contact | Menu broken | Form width, direct links | — |

---

## Screenshots

Screenshots were captured at 375×812 viewport for:
- Homepage (hero, proof bar, feature grid, selected work, footer)
- About
- Contact (form fields visible)

---

## Recommended Priority

1. **P0:** Fix mobile navigation (hamburger menu)
2. **P1:** Increase hamburger touch target size
3. **P1:** Add `width: 100%` to form inputs on contact page
4. **P2:** Improve touch targets for text-link buttons
5. **P2:** Review resume highlights grid on very narrow screens
6. **P3:** Optional refinements for associated properties and direct contact links
