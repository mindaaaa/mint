# mint garden — favicon set

Sprout-mark favicon on the sage · cream palette. Two leaves over a stem, echoing the `seedlings` → `growing` → `in full bloom` progression in the playground.

## Palette

| Role | Hex |
| --- | --- |
| Background | `#f5f1e8` (warm cream) |
| Stem / vein | `#5a7a4a` (deep sage) |
| Left leaf | `#8fae7a` (soft sage) |
| Right leaf | `#6b8e5a` (mid sage) |
| Ground line | `#b8a888` (warm clay) |
| Seed dots | `#8b7355` (earth) |
| Sun accent (512 only) | `#d4a26a` (amber) |

## Files

| File | Use |
| --- | --- |
| `favicon-16.svg` | Browser tab, address bar |
| `favicon-32.svg` | Browser tab (HiDPI), bookmark bar |
| `favicon-48.svg` | Windows site tile, taskbar |
| `apple-touch-icon.svg` | iOS home screen (180×180) |
| `favicon-512.svg` | PWA manifest, social cards |

Each size carries slightly different detail — 16px is the pure sprout, 32/48px add a subtle ground line, and larger sizes layer leaf veins, scattered seeds, and a hint of sunlight.

## HTML snippet

Paste inside `<head>`:

```html
<link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16.svg">
<link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32.svg">
<link rel="icon" type="image/svg+xml" sizes="48x48" href="/favicon-48.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg">
<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon-512.svg">
```

## Notes

- The cream background (`#f5f1e8`) is intentionally warm. If the playground's actual background is pure white or a different shade, swap the `<rect>` fill across all five files to match — the sprout colors will still read well on any near-neutral surface.
- For a dark-mode variant, consider inverting the background to a deep sage (`#2a3a24`) and brightening the stem — but the current design is tuned for the light editorial tone of the playground.
- PWA manifest: reference `favicon-512.svg` with `"purpose": "any maskable"`. The rounded-rect background is safe for masking.
