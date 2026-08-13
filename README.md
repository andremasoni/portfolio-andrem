# portfolio-andrem

Personal portfolio of **André Masoni Fraile**, backend Java developer in São Paulo, Brazil.

**Live:** https://sqlandr3.github.io/portfolio-andrem/

A static single-page site with no framework, no build step and no dependencies.
Everything is hand written: three files, roughly 25 KB of source.

---

## Why it is built this way

A portfolio that takes thirty seconds to boot a JavaScript bundle contradicts what it
claims about its author. The constraints below came first, and the design followed:

- **Content lives in the HTML.** Nothing is injected at runtime, so link previews,
  search engines and screen readers all receive the full page.
- **JavaScript is optional.** Scroll reveals are scoped to a `js` class that the page
  sets before the first paint. A blocked or failed script leaves the site readable
  instead of blank.
- **Nothing animates layout.** The reading progress bar and the timeline fill use
  `transform`, so scrolling stays on the compositor rather than triggering reflow.
- **Motion is a preference, not a default.** `prefers-reduced-motion` disables every
  animation, including the ones triggered on load.

## Features

| Feature | Notes |
|---|---|
| Light and dark themes | Follows the OS preference on first visit, then remembers the choice |
| Reading progress bar | Scroll position mapped to a compositor-friendly `scaleX` |
| Scrollspy navigation | Highlights the section currently being read |
| Staggered reveals | Entries sorted by vertical position so the cascade reads top to bottom |
| Animated timeline | Career steps light up as the scroll fill reaches each one |
| Copy e-mail | Falls back to the mail client when the Clipboard API is unavailable |

## Project structure

```
.
├── index.html            # Content and structure
├── styles.css            # Design tokens, layout, animations
├── main.js               # Progressive enhancement
├── favicon.svg           # Icon source
├── favicon.ico           # Fallback icon, 16/32/48 px frames
├── apple-touch-icon.png  # 180 px, square: iOS applies its own mask
├── icon-192.png
├── icon-512.png
├── site.webmanifest      # Android home screen metadata
├── andremasoni.jpg       # Profile photo, also the Open Graph preview
└── LICENSE
```

## Design system

**Type.** Bricolage Grotesque for display, Public Sans for body copy, JetBrains Mono
for labels and data.

**Colour.** The accent is `#5CE65C`. It measures roughly 1.6:1 against white, well below
the 4.5:1 minimum for text, so in the light theme it is restricted to fills with dark
text on top, and text and links use `#117411`, the same hue darkened to about 6:1.
The dark theme uses the accent directly, where it reaches roughly 12.9:1.

**Icon.** The `A` crossbar is drawn as a rule that overshoots both legs, echoing the
migration timeline used in the trajectory section.

## Running locally

```bash
git clone https://github.com/sqlandr3/portfolio-andrem.git
cd portfolio-andrem
python3 -m http.server 8000
```

Then open http://localhost:8000

Opening `index.html` directly from the file system also works, except that
`site.webmanifest` is blocked under the `file://` protocol. That warning is harmless
and does not affect the layout.

## Deploy

GitHub Pages serves the repository root. Pushing to the default branch publishes the site.

## Licence and copyright

Copyright © 2026 André Masoni Fraile. All rights reserved except where stated below.

**Source code** — the HTML, CSS and JavaScript in this repository — is released under the
[MIT License](LICENSE). Reuse it, learn from it, adapt it into your own site.

**Content is not licensed.** The written text, the career history, the profile photo, the
name and the personal branding remain fully reserved. Cloning this repository does not
grant permission to republish that material, with or without attribution. If you want to
build on the layout, keep the structure and replace the content with your own.

## Credits

Typefaces are served by Google Fonts and licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/):
[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque),
[Public Sans](https://fonts.google.com/specimen/Public+Sans) and
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono).
Icons are hand drawn SVG. No other third-party assets are used.
