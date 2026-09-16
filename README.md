# khalidt-alharbi.github.io

Personal portfolio of Khalid Alharbi. Plain HTML and CSS with one small script. No framework, no build step.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site. Every section is marked with a comment. |
| `styles.css` | All styling. Colours, fonts and spacing are tokens at the top. |
| `script.js` | The auto-advancing hero demo slider (pauses on hover) and the OnKith masking animation. The site still works without it. |
| `404.html` | Shown for any address that does not exist. |
| `assets/` | Images. |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Browser tab and home screen icons. |
| `og.png` | The preview image shown when the link is shared. |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Files for search engines and AI models. |

## Preview locally

Open `index.html` in a browser, or run a local server so the 404 page and absolute paths behave like the live site:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Add a project

In `index.html`, copy one `<article class="project">` block inside the Projects section and edit it. Keep the role line first: it tells the reader what you did before anything else.

## Change the look

Edit the tokens in the `:root` block at the top of `styles.css`. Changing `--accent` recolours every button, role line and link underline at once.
