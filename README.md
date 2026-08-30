# tere haath kabhi na aani

A single button that does not want to be clicked.

You go to press it, it steps aside and says **"you thought"**. It has 19 evasion
tricks, reads where your cursor is *heading* rather than where it is, and gets
meaner in four tiers. Catching it is meant to be almost — but not quite —
impossible.

## Playing it

Open `index.html`. No build step, no dependencies, no backend, no API keys.

Sheila plays over the title card; the start button only appears once the clip
has finished. Then: approach it and find out.

- Keys **1–4** force a difficulty tier (for demoing).
- The **"i give up"** button also runs away.

## How it works

- **Evasion** — 19 tricks: sidestep, feint, slingshot, hop, zip, moonwalk,
  swing, wallbounce, corner, mirror, drop, duck, camo, morph, split, glitch,
  melt, tease, mercy. All are eased tweens; there is no physics engine.
- **Reading you** — it flees the point your cursor is projected to reach in
  ~160ms, so a fast lunge gets cut off instead of chased. A stationary cursor
  is left alone.
- **Winning** — recovery time is not an opening; the button is click-through
  while it recovers. The only catchable moments are a rare *stumble* (tier
  gated) and the *mercy* move, both loudly telegraphed. The stumble throws it
  clear of your cursor first, so you have to cross the gap.
- **Performance** — only `transform` and `opacity` ever animate. No filters,
  no animated shadows. Nothing touches the DOM unless something moved.

## Layout

    index.html   markup + all styling
    game.js      the whole game
    audio/       the intro clip
    sfx/         29 sound effects
    memes/       7 reaction clips

## Tuning

In `game.js`:

- `TIERS[]` — `near` (personal space), `stun` (recovery), `dist`, `moves`
- `tripOdds` in `dodge()` — how often it stumbles into a catchable state
- `S.dodges % 3` in `dodge()` — meme frequency
- `SHEILA_SRC` at the top — the intro clip path

## Assets

Sound effects and reaction clips are third-party media gathered for a one-day
hackathon demo. Swap them for rights-cleared equivalents before using this
anywhere that matters.
