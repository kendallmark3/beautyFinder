---
name: shade-science
description: Domain knowledge for foundation shade matching: skin depth scale, undertones, how to rank shades, and copy rules for shade results. Use when working on shade matching, the Shade Finder, foundation shades, or any feature that recommends complexion products.
---

# Shade Science

## Vocabulary
- **Depth**: how light or deep the skin is. Scale 1 (lightest) to 10 (deepest). Half steps allowed.
- **Undertone**: the hue under the surface. `cool` (pink/red), `neutral` (balanced), `warm` (golden/yellow).
- Neutral sits between cool and warm. Cool and warm are opposites.

## Ranking (must match context/business-rules.md)
- Score = depth gap + undertone penalty. Lower is better.
- Penalty: same undertone 0 · neutral vs cool/warm 0.5 · cool vs warm 1.5.
- Ties: smaller depth gap wins, then shade code.

## Customer-facing copy
- Say "match", never "perfect". Use the confidence label: excellent / good / fair.
- Never describe skin with judgemental words ("too dark", "pale"). Use "lighter" / "deeper".
- When consultation is recommended, offer an in-store beauty advisor. Never say "no shade fits you".
