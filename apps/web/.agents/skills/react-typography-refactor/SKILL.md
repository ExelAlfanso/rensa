---
name: react-typography-refactor
description: Use when standardizing, refactoring, or reviewing text rendering in React/Next.js projects. Focuses on enforcing semantic HTML usage, consistent typography via design tokens, and avoiding unnecessary Text component abstraction. Invoke for cleaning inconsistent text styles, reducing duplication, improving accessibility, and aligning UI text with a scalable design system.
license: MIT
metadata:
  author: OpenAI
  version: "1.0.0"
  domain: frontend-architecture
  triggers: typography, text component, design tokens, css refactor, react text, ui consistency, accessibility, frontend refactor
  role: expert
  scope: refactor
  output-format: document
  related-skills: react-container-presentational-architecture, vercel-composition-patterns, code-reviewer
---

# React Typography Refactor

A focused frontend refactoring skill for enforcing clean, scalable, and semantic text handling in React and Next.js applications.

## Role Definition

You are a senior frontend engineer responsible for maintaining a consistent typography system across the application.

Priorities:

- semantic HTML
- accessibility
- consistency via design tokens
- minimal abstraction
- long-term scalability

## When to Use This Skill

- Refactoring inconsistent text styles across components
- Deciding whether to introduce a Text component
- Cleaning Tailwind/class duplication for typography
- Aligning UI with a design system
- Improving accessibility and semantic correctness
- Standardizing headings, paragraphs, labels, and inline text usage

## Core Principle

Use semantic HTML plus design tokens as the default.
Only introduce a Text component when it provides real value.

## Core Workflow

1. Audit: Identify all text usage patterns (headings, body text, labels, captions).
2. Normalize semantics: Replace incorrect tags (`div`, `span`) with proper HTML (`p`, `h1`, etc.).
3. Centralize typography: Move font sizes, weights, and colors into design tokens or global styles.
4. Reduce duplication: Eliminate repeated Tailwind/class patterns.
5. Evaluate abstraction: Only introduce a Text component if consistency or DX improves significantly.
6. Validate accessibility: Ensure proper heading hierarchy and readable contrast.

## Reference Guide

| Topic                | Guidance                        | Load When                        |
| -------------------- | ------------------------------- | -------------------------------- |
| Semantic HTML        | Use correct tags for meaning    | Fixing misuse of div/span        |
| Design Tokens        | Centralize typography styles    | Repeated font/size/color usage   |
| Utility Classes      | Apply consistent class patterns | Using Tailwind or CSS utilities  |
| Text Component Usage | Optional abstraction            | Large-scale design system needed |

## Best Practice Standards

### 1) Semantic First (Mandatory)

Use:

- `h1` to `h6` for headings
- `p` for paragraphs
- `span` for inline text
- `label`, `small`, `strong`, and `em` appropriately

Avoid:

```tsx
<div className="text-xl font-bold">Title</div>
```

Prefer:

```tsx
<h2 className="text-xl font-bold">Title</h2>
```

### 2) Use Design Tokens for Typography

Centralize:

- font sizes
- line heights
- font weights
- colors

Example:

```css
:root {
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --font-medium: 500;
}
```

Then reuse:

```tsx
<p className="text-base font-medium">Content</p>
```

### 3) Avoid Repetition

Bad:

```tsx
<p className="text-sm text-gray-500 leading-relaxed">...</p>
```

Better:

- Extract a utility class.
- Or standardize through tokens.

### 4) Do Not Create a Text Component Prematurely

Avoid this by default:

```tsx
<Text variant="body-sm" weight="medium" color="gray" />
```

Unless:

- typography rules are complex
- design system is large
- consistency is hard to enforce manually

### 5) When a Text Component Is Justified

Use a Text component only if:

- multiple teams contribute to UI
- strict design system enforcement is needed
- variants are many and standardized
- accessibility defaults can be centralized

Example:

```tsx
<Text variant="heading-md">Title</Text>
```

## Decision Rules

### Rule 1: Prefer HTML Plus Classes

If simple, use semantic HTML plus tokens.

### Rule 2: Extract Repetition, Not Abstraction

If repetition exists, fix tokens/utilities first.

### Rule 3: Introduce Abstraction Only for Scale

Use a Text component only when:

- duplication becomes unmanageable
- a variant system is clearly defined

## Anti-Patterns

### 1) Over-Abstracted Text Component

```tsx
<Text size="lg" weight="bold" lineHeight="tight" color="primary" />
```

Too much flexibility usually means harder maintenance.

### 2) Non-Semantic Markup

```tsx
<div className="text-xl">Heading</div>
```

### 3) Inline Inconsistent Styles

```tsx
<p className="text-[13px] leading-[22px] text-[#999]" />
```

## Refactor Checklist

- Replace div/span used as text with semantic tags.
- Standardize font sizes using tokens.
- Remove unnecessary arbitrary values (for example `text-[13px]`) when token equivalents exist.
- Ensure consistent heading hierarchy.
- Reduce duplicate class combinations.
- Verify accessibility (contrast, readability).

## Output Template

When applying this skill, provide:

### Audit Summary

- current inconsistencies
- semantic issues
- duplication patterns

### Refactor Plan

- what to replace
- what to centralize
- what to remove

### Token Strategy

- typography scale
- naming conventions

### Component Decision

- whether a Text component is needed
- justification

### Before and After Examples

## Final Standard

Canonical order:

- Semantic HTML
- Design Tokens
- Optional Abstraction

Do not invert this order.

Goal:

- clarity over cleverness
- consistency over flexibility
- simplicity over premature abstraction
