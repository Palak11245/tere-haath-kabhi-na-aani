# PRD: The Uncatchable Button

**One-liner:** A single button that actively evades the user's cursor using escalating, bizarre evasion tactics, while unleashing unhinged sound effects and personally passive-aggressive commentary — engineered to be almost, but not quite, impossible to click.

**Stack:** Single-page HTML/CSS/JS. No backend, no LLM. Client-side logic, with optional free public APIs for asset sourcing (see Asset Sourcing section).

---

## Core Loop
1. Button spawns center-screen, normal size, still, label: "Click me."
2. Page load plays the opening cue (see Intro Beat).
3. Cursor approaches → proximity trigger fires an evasion behavior.
4. Miss → attempt counter increments, sound cue fires, possible comment fires.
5. Escalate difficulty over time/attempts.
6. Rare successful click → win state.

---

## Intro Beat
- On page load, plays **"Sheila Ki Jawaani" — "haath kabhi na aani"** clip (user-provided audio file, see Asset Sourcing)
- This sets the entire premise up front: the button is telling you, from second one, that you will not catch it
- Optionally sync a title-card animation with the clip ("You Won't Get This.") before gameplay becomes interactive

---

## Evasion Behaviors (rotate randomly within current tier — never scripted/predictable, push these to be as bizarre as possible)

- **Dodge** — teleports/slides away when cursor enters radius threshold
- **Flee-runner** — continuously moves away from cursor in real time based on velocity/direction (true chase, not a jump)
- **Shrink** — reduces size % per approach or miss
- **Fake-out** — occasionally holds still to bait a click, dodges at last frame
- **Split** — spawns 2+ decoys at higher tiers; only one is real, others vanish harmlessly (or fake-explode) on click
- **Morph** — shifts shape (circle → sliver → dot → blob → random polygon) so the real hitbox keeps shifting
- **Color camo** — briefly blends into background before reappearing elsewhere
- **Orbit** — circles a fixed point at increasing speed instead of fleeing linearly
- **Reverse psychology** — rare moment it moves toward the cursor (genuine mercy chance)
- **Edge-cling** — hides partially off-screen, requiring precise placement to catch the visible sliver
- **Spin-out** — spins rapidly in place while fleeing, purely for visual chaos, no functional purpose beyond bizarre spectacle
- **Glitch-teleport** — brief visual "glitch" effect (screen tear / RGB split styling) right before it teleports, for extra "what just happened" energy

Push the design of these toward maximum absurdity in execution (animation style, easing, visual flair) — the mechanic list above is a floor, not a ceiling. Bizarre and unpredictable > clean and polished.

## Escalation Tiers

| Tier | Attempts | Behavior |
|---|---|---|
| 1 | 1–5 | Slow dodge only, large size |
| 2 | 6–15 | Dodge + shrink, moderate speed |
| 3 | 16–30 | Full suite (morph, split, camo, spin-out), fast |
| 4 | 30+ | Tiny, camouflaged, erratic orbit, glitch-teleport active |

## Win Condition
- Confetti burst + Bollywood-style victory sting (or whatever unhinged celebratory sound Claude Code sources — see Asset Sourcing)
- Modal: "Certificate of Uncatchable Button Achievement" — timestamp, total attempts, downloadable/screenshottable
- Line: "You beat a button. Go outside."

## Live Stats (corner HUD)
- Attempts, dodges survived, time elapsed
- Optional: localStorage personal best (fastest catch / most attempts before quitting)

---

## Commentary System

**Tone directive:** Comments should read as personal, passive-aggressive attacks — not generic gamer taunts. They should feel like they're needling the specific user in the room, calling out their behavior/choices in a targeted, slightly mean way. Dry delivery, no exclamation-point energy except on the big milestone lines. Think "a friend who has clearly had enough of you," not "video game NPC."

### Behavioral/speed-based triggers (via `mousemove` timestamp deltas)
- Fast/erratic movement → "Slow down, you're not going to catch a button by panicking. That's also just advice for your life."
- Slow/deliberate movement → "Oh, we're being strategic now? A little late for that, isn't it?"
- Rapid direction reversal → "Pick a direction. In this and everything else."
- Idle cursor (no movement N seconds) → "The button is right there. You're just high. Or worse — bored of trying."
- Repeated identical approach angle → "Trying the same thing again? Bold of you to think that'll work this time."
- Tab left and returned (`visibilitychange`) → "Oh, you're back. Missed me, or just avoiding something more important?"
- Near-miss (cursor within a few px, dodge triggers just in time) → "SO close. Genuinely embarrassing how close that was."

### Time/attempt milestones
- 1 min, no win → "Get a job."
- 3 min → "What are you doing with your life."
- 5+ min → "This is now a cry for help, and I'm not qualified to help you."
- 10+ min → "I've seen people give up on healthier things than this faster."

### Mercy moment
If reverse-psychology dodge fires and they STILL miss → "...how. Genuinely, how."

### Display rules
- One comment at a time, short cooldown between triggers, no stacking
- Pull randomly from an unused-comment pool per category; reset pool once exhausted (no back-to-back repeats)
- Comments should feel targeted and specific to what the user just did, not generic filler — favor lines that reference their actual behavior (speed, idling, repetition) over throwaway insults

### Starter comment bank (expand to 30–40 total before shipping, keep the personal/passive-aggressive tone consistent)
- "Get a job."
- "The button is right there. You're just high."
- "What are you doing with your life."
- "This is genuinely concerning, and I say that with love. Actually, no love."
- "I've seen toddlers with better hand-eye coordination, and worse life choices than you."
- "Have you considered that this says something about you?"
- "It's a button. It has one job. So do you, presumably. Neither of us is doing great."
- "Your mouse sounds tired. Honestly, so do you."
- "I respect the commitment to a bad decision. It's very 'you.'"
- "This is the most effort you've put into anything today, and it's still not enough."
- "You're not going to catch me. I've seen your track record."
- "Some people would call this practice. I call it a pattern."

---

## Sound & Meme Layer

**Directive:** sound effects should be unhinged, bizarre, and over-the-top — not tasteful or subtle. Lean into jarring, comedic excess rather than polish.

### Sound cue sheet

**Opening (user-provided, fixed):**
- Page load → "Sheila Ki Jawaani" ("haath kabhi na aani") clip

**Everything else — Claude Code's discretion, but push toward maximum unhinged energy:**
- Dodge / near-miss → something jarring and comedic (vine boom, air horn, glass shatter, demonic laugh — whatever lands as most unhinged, doesn't need to make literal sense)
- Rage-click detected (rapid clicks in short window) → increasingly frantic/chaotic sound escalation, get weirder the more they click
- Idle cursor (no movement for N seconds) → something eerily quiet or absurd (crickets, a slow ominous drone, a whispered taunt)
- Tier escalation → an over-the-top "power-up" style sting, the more ridiculous the better
- Milestone hits (3 min, 5 min, 10 min) → increasingly dramatic/unhinged stings, escalate the absurdity as milestones climb
- Win state → maximalist celebratory chaos (air horns, fireworks sound, screaming crowd, whatever's funniest)

### Meme/GIF overlays
- Fire on select milestones only (tier escalation, big time milestones, win state) — not on every dodge, to avoid stepping on commentary timing
- Content: Claude Code's discretion — lean into the most bizarre/ridiculous reaction images or GIFs available, not tasteful choices
- Display as a small overlay near the HUD, auto-dismiss after a few seconds

### Asset sourcing — who provides what
- **"Sheila Ki Jawaani" opener clip**: provided manually by the user, dropped into a local `/audio` folder (e.g. `/audio/sheila-ki-jawaani.mp3`). Claude Code should reference this by a clearly-named placeholder path and wire up playback on page load — do not attempt to source or substitute this clip.
- **Every other sound effect**: Claude Code's full discretion to source (e.g. via the Freesound API, free key) or synthesize — no manual gathering required from the user. Prioritize unhinged/bizarre over "appropriate."
- **Meme/GIF overlays**: Claude Code's full discretion to source (e.g. via the Giphy API, free key) by mood tag — no manual gathering required from the user.
- Copyright note: non-commercial, one-day live demo only — no concern here. Do not redeploy this build publicly afterward without swapping in rights-cleared content.

---

## Tech Notes
- `requestAnimationFrame` for smooth flee/orbit motion (not discrete jumps)
- Cursor velocity = delta position / delta time from `mousemove` events
- Idle detection = no `mousemove` fired for N seconds
- Clamp button position within viewport (except intentional edge-cling)
- Randomize evasion + comment + sound selection within constraints to avoid feeling scripted on repeat plays
- Keep the `/audio/sheila-ki-jawaani.mp3` reference as a named constant at the top of the file so it's a one-line swap if the filename changes

## Explicit Non-Goals
- No LLM/API calls for commentary generation (static, hand-written comment bank — jokes need to be tight and pre-tested, not generated fresh)
- No backend, no user accounts
- No persistence beyond optional localStorage best score
- No mobile touch handling unless added as stretch

## Stretch Goals (only if time remains)
- A "give up" button that also flees
- Manual difficulty-tier selector for live demo purposes (jump straight to Tier 4 chaos for judges)
- Escalating visual chaos on the page background itself as tiers increase (screen shake, color shifts, etc.)
