# khalidt-alharbi.github.io

Personal portfolio of Khalid Alharbi.

- **Live site (English):** https://khalidt-alharbi.github.io/
- **Live site (Arabic):** https://khalidt-alharbi.github.io/ar/

Plain HTML and CSS with one small script. No framework, no build step, nothing to install. Every file you edit is exactly what visitors get.

---

## How changes go live

This repository **is** the website. GitHub Pages publishes whatever is on the `main` branch.

1. Change a file and commit it to `main`.
2. Wait about a minute.
3. Open the site and refresh. If you still see the old version, do a hard refresh (`Ctrl + Shift + R`) or open it in a private window.

To watch a publish happen, open the **Actions** tab of this repository. A green tick means the new version is live. A red cross means it failed; click it to see why.

## Two ways to edit

**A. In the browser, on github.com (easiest).**
Open a file on GitHub, click the pencil icon (Edit), make the change, then click **Commit changes**. Leave "Commit directly to the main branch" selected. That is it; the site updates a minute later.

**B. On your computer.**
The repository is cloned at `C:\Users\iimrk\Desktop\Portfolio`. Edit the files, then:

```
git add -A
git commit -m "Describe what you changed"
git push
```

Before pushing, you can preview the site locally (see [Preview on your computer](#preview-on-your-computer)).

---

## Where everything lives

| I want to change... | Open this file | Look for this comment or text |
|---|---|---|
| Name, position line, skills line | `index.html` | `HERO` |
| The Download CV button | See [Add or replace your CV](#add-or-replace-your-cv) | |
| The About paragraphs | `index.html` | `ABOUT`, then the `<p>` lines |
| The facts panel (Based in, Toolkit...) | `index.html` | `<dl class="facts">` |
| A project | `index.html` | `PROJECTS`, then the project's name |
| Education | `index.html` | `EDUCATION` |
| Email, contact line, social links | `index.html` | `CONTACT` |
| The animated demos at the top | `index.html` | `HERO SHOWCASE` |
| Anything in Arabic | `ar/index.html` | Same comments, in Arabic headings |
| Colours | `styles.css` | The `:root` block at the very top |
| The tab title and Google description | `index.html` | `<title>` and `<meta name="description"` near the top |
| The picture shown when the link is shared | `og.png` | See [Share preview image](#share-preview-image) |

**Rule of thumb:** English and Arabic are two separate pages. Whenever you change something in `index.html`, make the same change in `ar/index.html`, or the two versions will say different things.

In `ar/index.html`, file paths start with `../` (for example `../assets/photo.jpg`), because that page lives one folder deeper.

---

## Add or replace your CV

The **Download CV** button is already built. It stays **hidden** until the CV file exists, so the site never shows a broken button.

**To add it:**

1. Save your CV as a PDF named exactly **`Khalid-Alharbi-CV.pdf`**. The name must match exactly, capital letters included.
2. On GitHub, open the repository's main page, click **Add file**, then **Upload files**.
3. Drag the PDF in and click **Commit changes**.
4. A minute later, the button appears on both the English and Arabic pages.

**To replace it:** upload a new PDF with the same name. GitHub replaces the old one.

**To remove it:** open `Khalid-Alharbi-CV.pdf` on GitHub, click the `...` menu, then **Delete file**. The button hides itself again.

**To use a different file name:** change `href="Khalid-Alharbi-CV.pdf"` in `index.html` and `href="../Khalid-Alharbi-CV.pdf"` in `ar/index.html`.

> Before uploading, remember this file is public. Anyone can download it, so leave off anything you would not post online, such as a home address or phone number.

---

## Change the text at the top (hero)

In `index.html`, find `HERO`. The three lines are:

```html
<h1 id="hero-name">Khalid Alharbi</h1>
<p class="identity">Aspiring AI software engineer. <span>Builds from data to firmware.</span></p>
<p class="hero-sub">Building NLP training data and ...</p>
```

- **The first part of `identity`** is your position: where you are heading. Keep it short.
- **The part inside `<span>`** shows on its own line in a lighter colour.
- **`hero-sub`** is your skills and where you study.

If you change these, also update the `<title>` and `og:title` lines near the top of the file, which is what shows in the browser tab and in shared links.

## Change the About section

In `index.html`, find `ABOUT`.

- **Paragraphs** are the `<p>` lines inside `<div class="about-body">`. The first paragraph is shown slightly larger.
- **Facts** are the lines inside `<dl class="facts">`. Each fact looks like this:

  ```html
  <div><dt>Based in</dt><dd>Jeddah, Saudi Arabia</dd></div>
  ```

  `<dt>` is the small orange label and `<dd>` is the value. Copy a whole line to add a fact, or delete a whole line to remove one.

## Edit, add or remove a project

In `index.html`, find `PROJECTS`. Each project is one block that starts with `<article class="project card">` and ends with `</article>`.

**Inside a project block:**

| Part | What it is |
|---|---|
| `<picture>` ... `<img src="assets/...">` | The image at the top of the card |
| `<a class="media-pill" href="...">` | The "Visit site" button on the picture. Delete this line if the project has no website. |
| `<h3>` | The project name |
| `<p class="role">` | Your role, team size, where, and year. Keep this first and honest: it tells the reader what **you** did. |
| `<p class="summary">` | One or two sentences on what the project is |
| `<ul class="tags">` | The small technology labels. One `<li>` per label. |
| `<div class="links">` | Links under the summary, such as Website, Repository or Dataset. Delete the whole block if there are none. |
| `<details class="details">` | The "Details +" section that opens on click. Each `<p>` is one paragraph. |

**To add a project:**

1. Copy an entire `<article class="project card"> ... </article>` block.
2. Paste it next to the others, then change the text.
3. For the picture, upload an image into the `assets` folder (on GitHub: open `assets`, then **Add file**, then **Upload files**). Then point the card at it:

   ```html
   <picture>
     <img src="assets/my-project.jpg" width="1200" height="800" loading="lazy" alt="Describe what the picture shows">
   </picture>
   ```

   Change `width` and `height` to the image's real size in pixels. Use a landscape image about 1200 pixels wide and under about 300 KB. Always write a real description in `alt`, for people using screen readers.
4. No picture? Copy the Cooling system card instead: it uses a drawn icon, not a photo.
5. Add the same project to `ar/index.html`, with `../assets/...` for the image path.

**To remove a project:** delete its whole `<article> ... </article>` block, in both files.

**To reorder projects:** move whole blocks up or down. The page shows them in the order they appear in the file.

## The animated demos at the top

In `index.html`, find `HERO SHOWCASE`. There are two slides:

- **HI-BSDS** (`id="demo-hi-bsds"`): the helmet diagram.
- **OnKith** (`id="demo-onkith"`): the scanner that finds and masks personal information.

What you can safely change:

- **The caption under each demo:** the `<figcaption>` line of that slide.
- **How long each slide stays before the next one:** `data-duration="9000"` on the slide, in milliseconds. `9000` means 9 seconds.
- **The OnKith demo sentences:** the `<li>` lines inside `<ul class="scan-text">`. Each masked word is wrapped like this:

  ```html
  <span class="pii"><span class="pii-raw">Noura</span><span class="pii-mask" aria-hidden="true">[GIVENNAME]</span></span>
  ```

  `pii-raw` is what shows first and `pii-mask` is what it turns into. Only ever use invented names and numbers here.

Adding a third slide is possible (copy a `<figure class="slide">` block and add a matching `<button class="tab" data-slide="2">`), but the diagram and scanner are custom-built, so a new slide would need its own content. Ask for help with that one.

## Education

In `index.html`, find `EDUCATION`. Each card is one `<li class="card edu-card">` block:

- `<p class="when">`: the dates, in orange
- `<h3>`: the institution
- `<p class="what">`: the degree or programme
- `<p class="note">`: one extra line
- `<span class="badge">`: the small outlined label, such as the GPA. Delete this line to remove it.

## Contact

In `index.html`, find `CONTACT`.

- **The bold line** is `<p class="contact-kicker">`.
- **The email** appears twice on the same line: once in `href="mailto:..."` and once as the visible text. Change both.
- **Social links** are the `<li>` lines in `<ul class="contact-links">`. Copy one to add a link, or delete one to remove it.

If you change your email, LinkedIn or GitHub address, also update the `"sameAs"` list near the top of both pages and the Contact section of `llms.txt`.

---

## Colours

All colours are named values at the top of `styles.css`, inside the `:root` block. The most useful ones:

| Name | What it colours |
|---|---|
| `--accent` | Buttons, orange labels, link underlines, highlights. Currently copper `#E0915A`. |
| `--accent-rgb` | The same colour as three numbers. **Change it together with `--accent`**, or glows and tints will stay the old colour. |
| `--bg` | The main page background |
| `--band` | The lighter background of every second section |
| `--text`, `--text-2`, `--text-3` | Main, secondary and faint text |

**To switch the whole site to the blue version:** a complete blue colour set is already in `styles.css`, under `[data-theme="blue"]`. Turn it on by adding `data-theme="blue"` to the second line of **both** pages:

```html
<html lang="en" dir="ltr" data-theme="blue">          <!-- index.html -->
<html lang="ar" dir="rtl" data-theme="blue">          <!-- ar/index.html -->
```

Remove it again to go back to green.

## Share preview image

`og.png` is the picture that appears when someone shares the link on WhatsApp, LinkedIn, X or Slack. It must be **1200 x 630 pixels**. To change it, upload a new image with exactly the same name, `og.png`.

Apps remember old previews for a while, so a changed image can take a few days to show up in links shared earlier.

## Tab title and Google description

Near the top of each page:

- `<title>`: the text in the browser tab and the headline Google shows. Keep it under about 60 characters.
- `<meta name="description" ...>`: the sentence Google shows under the headline. About 150 characters.
- The `og:` and `twitter:` lines repeat the same text for shared links. Keep them in step.

---

## Preview on your computer

From the `Portfolio` folder:

```
python -m http.server 8000
```

Then open http://localhost:8000 (English) or http://localhost:8000/ar/ (Arabic). Stop the server with `Ctrl + C`.

Always check a change on your phone too. Most visitors will see the site on a phone first.

## Files

| File | What it is |
|---|---|
| `index.html` | The English page. Every section is marked with a comment. |
| `ar/index.html` | The Arabic page (right to left). Keep it in step with `index.html`. |
| `styles.css` | All styling. Colours are named values at the top. |
| `script.js` | The CV button check, the demo slider, and the OnKith scanner. The page still reads fine without it. |
| `404.html` | Shown for any address that does not exist. |
| `assets/` | Project images. |
| `Khalid-Alharbi-CV.pdf` | Your CV. **Not uploaded yet.** See [Add or replace your CV](#add-or-replace-your-cv). |
| `og.png` | The picture shown when the link is shared |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons |
| `robots.txt`, `sitemap.xml` | Help search engines find the pages. Update the `<lastmod>` dates in `sitemap.xml` after big changes. |
| `llms.txt` | A plain summary of the site for AI assistants. Keep it in step with the projects. |
| `.nojekyll` | Tells GitHub Pages to publish the files exactly as they are. Do not delete. |

## Things that will break the site if changed

- **Renaming or moving** `index.html`, `ar/index.html`, `styles.css`, `script.js` or the `assets` folder.
- **Deleting a closing tag** such as `</div>` or `</article>`. If a section suddenly looks wrong after an edit, a missing closing tag is the most likely cause. Undo the change and try again.
- **Changing `class="..."` or `id="..."` names.** The styling and the slider depend on them. Change the text between tags freely; leave the tag attributes alone unless you know what they do.

If something breaks, every change is saved in the **Commits** history, so you can always go back. On GitHub, open the file, click **History**, pick the last version that worked, and restore its contents.

## Later: your own domain

The site can move from `khalidt-alharbi.github.io` to a name like `khalidalharbi.dev` whenever you buy one. It needs a setting in this repository (**Settings**, then **Pages**, then **Custom domain**) plus DNS records at the domain seller. Do this step with help, because deleting the wrong DNS record is easy and hard to notice.
