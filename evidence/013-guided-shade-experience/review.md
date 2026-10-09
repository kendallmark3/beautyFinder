# Human review: Guided Shade Experience

The intent (`intent/features/013-guided-shade-experience.md`) requires a person to review the running experience
visually. **This has not been done.** The builder is not that person. Open
http://localhost:3000/shade-finder.html (or the port the app is running on), go through it on a
desktop window and on a phone, and answer below.

| Question (from the intent) | Answer | Notes |
|----------------------------|--------|-------|
| Does this feel like a beauty experience? | | |
| Is the shopper being guided rather than simply filling in fields? | | |
| Can I clearly see what changed when I interact with it? | | |
| Does the recommendation feel like a discovery? | | |
| Would I be comfortable using this application to demonstrate Progressive Intent to L'Oréal? | | |

Reviewed by: ____________  Date: ____________

If the answer to a significant question is no, write the observation here. Per the intent, it
becomes the input to the next smallest intent; the application is not redesigned.

## Builder's observations

These are what the builder noticed while capturing evidence. They are input to the review, not
a substitute for it.

1. **A shopper who picks Golden can be recommended a neutral shade.** At depth 8.5, Golden, the
   recommendation is 340 Cocoa (neutral) and 330 Warm Amber (her own undertone) is second,
   though both score 0.5 and both are labelled excellent. At depth 5, In between, the
   recommendation is 230 Honey Beige (warm) ahead of 220 Natural Buff (neutral). This is
   BR-SM-3 working as written: on a tie the smaller depth gap wins. The intent says matching is
   authoritative, so nothing was changed, but now that the page says in words how the
   recommendation differs from her choice, the effect is easier to see. A candidate for the
   next intent.
2. **The photograph changes with depth only, and at four points.** There are four models for
   nineteen depths, and undertone never changes the photo. The coloured circle is what shows
   every change. Whether that is enough to "clearly see what changed" is a review question.
3. **On a phone the photograph and large circles scroll out of view while choosing.** Feedback
   while choosing comes from the tone strip and the three undertone circles; the
   recommendation card carries its own pair of circles.
4. **There are now two guided experiences**: Discover (model, undertone, finish, eyes, lips,
   cheeks, a whole look) and this Shade Finder (depth, undertone, one foundation). They share
   the undertone wording. Whether both should exist is a product question.
5. **Two intents are titled "Feature 007"** in their text: `007-beauty-discovery.md` and this one. The file
   was first added as `Feature7.md` and is now `013-guided-shade-experience.md`, matching its evidence and
   tests. Its title line still reads "Feature 007", as its author wrote it.
6. **The consultation notice is still unreachable** with the shipped catalog (best score never
   exceeds 1.0), as recorded for Feature 002.
