# Examples

Four videos built with the remotion-motion-graphics skill, in one Remotion project. Claude Code produced each one by following the skill: theme object, five-layer scene stack, spring entrances, staggered timing, and the mandatory render, extract frames, inspect, fix, re-render loop. The audio comes from the scripts in `scripts/`, which synthesize every sound as a WAV; there are no asset downloads.

| Composition | What it is |
|---|---|
| `HaidrrrryPromo` | 12s profile promo: spark logo sting, word reveals, staggered cards, glow CTA |
| `FocusCatPromo` | 15.5s app promo: pixel-art mascot drawn in code (2-frame walk cycle), animated focus ring, synthesized SFX, warm ambient pad |
| `SelfFix` | 18.5s "watch this video fix itself": one scene opens deliberately bad (linear easing, flat background, no stagger, no grade) and upgrades live as each rule stamps in |
| `CodeEdit` | 20s beat-synced code edit: camera inside a syntax-glow code world, zoom punches on beats, RGB-split glitch pass, 3D code-shatter finale, original 120 BPM track |

Preview of `FocusCatPromo`. Click it for the MP4 with sound:

[![Focus Cat promo](videos/focus-cat.gif)](https://github.com/haidrrrry/claude-remotion-skill/raw/main/examples/videos/focus-cat-promo.mp4)

## Run

```bash
npm install
npm run audio            # writes deterministic 16-bit WAVs into public/sfx/
npm run studio           # browse all four in Remotion Studio
npm run render:focuscat  # or render:selffix / render:codeedit / render:profile
```

Verify the way the skill demands, by looking at extracted stills:

```bash
npx remotion still src/index.ts SelfFix out/check_300.png --frame 300 --overwrite
```

## Notes

- `src/theme.ts` (dark tech) and `src/focuscat/theme2.ts` (warm editorial) are the two palettes from `references/design-rules.md`.
- `src/focuscat/PixelCat.tsx` draws the mascot as a CSS pixel grid; swap the sprite strings to make your own.

## MoossReel — Malayalam health-awareness Reel

`MoossReel` is a 25s 1080×1920 Instagram Reel for Ashtavaidyan Pulamanthole Mooss on the topic
"ഒരേ ആയുർവേദ മരുന്ന് എല്ലാവർക്കും ഒരുപോലെ ഗുണം ചെയ്യുമോ?". It has Malayalam kinetic type, subtitles,
voice-over, procedural herbal B-roll (no stock footage, no people) and the client logo.

```bash
npm run audio:mooss    # needs espeak-ng (with the "ml" voice) and ffmpeg
npm run render:mooss   # -> videos/mooss-reel-medicine-not-same-for-all.mp4
```

- Script, scene timing and subtitles live in `src/mooss/timeline.json`.
- **Brand:** `public/brand/` holds the official logo (`mooss-logo-full.jpg`) and the emblem and
  wordmark crops. Use `src/brand/MoossBrand.tsx` (`BrandEmblem`, `BrandWordmark`) in every Mooss video.
- Fonts (Noto Serif Malayalam, Anek Malayalam, Cormorant Garamond, all SIL OFL) are self-hosted in
  `public/mooss/fonts/`, so the reel renders offline. `src/mooss/index.ts` is a stand-alone entry for that reason.
- Audio is generated, not downloaded. The voice is espeak-ng synthesis, the tanpura drone and bell are synthesized
  by `scripts/gen-mooss-audio.mjs`, and the SFX come from `scripts/gen-sfx.mjs`. To use a human voice-over, replace
  `public/mooss/vo0.wav`…`vo4.wav` and update `src/mooss/vo-durations.json`.
