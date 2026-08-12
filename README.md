# portfolio-andrem

Personal portfolio of André Masoni Fraile, backend Java student based in São Paulo, Brazil.

Live at https://sqlandr3.github.io/portfolio-andrem/

## Stack

Static site. No framework, no build step, no dependencies.

| File | Role |
|------|------|
| `index.html` | Content and structure. Everything renders without JavaScript. |
| `styles.css` | Design tokens and layout. Light and dark themes via `[data-theme]`. |
| `main.js` | Progressive enhancement: theme toggle, reading progress, scrollspy, scroll reveals, copy e-mail. |
| `andremasoni.jpg` | Profile photo, also used as the Open Graph preview image. |
| `favicon.svg` | Source of the icon. The `A` crossbar is drawn as a rule that overshoots both legs, echoing the migration timeline on the page. |
| `favicon.ico` | Fallback for older browsers, containing 16, 32 and 48 px frames. |
| `apple-touch-icon.png` | 180 px, square on purpose: iOS applies its own corner mask. |
| `icon-192.png`, `icon-512.png`, `site.webmanifest` | Android home screen and install prompt. |

Fonts are loaded from Google Fonts: Bricolage Grotesque, Public Sans, JetBrains Mono.

## Theme

The theme follows the operating system preference on first visit and the chosen value is
stored in `localStorage`. Storage access is wrapped in `try/catch`, so the toggle keeps
working where storage is blocked, it just does not persist between visits.

The accent `#5CE65C` measures around 1.6:1 against white, below the 4.5:1 minimum for text.
In the light theme it is therefore restricted to fills with dark text on top, and text and
links use `#117411`, the same hue darkened. In the dark theme the accent is used directly.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

GitHub Pages serves the repository root. Pushing to the default branch publishes the site.
