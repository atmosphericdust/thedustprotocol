# The Dust Protocol — static site

Plain HTML, CSS and JavaScript. No build step, no framework, no WordPress.
Everything is served as files, which is all GitHub Pages can do.

```
index.html          Home
about.html          The protocol + the architects
events.html         Event list with category filters
contact.html        Enquiry form + details
404.html            Not-found page (GitHub Pages serves this automatically)
assets/css/style.css
assets/js/events.js Event data — edit this to add events
assets/js/main.js   Navigation, hero graphic, event rendering
assets/img/         Put images here (see "Images" below)
CNAME               Custom domain
.nojekyll           Stops GitHub from running Jekyll over the files
about-2/, contact-2/, events/   Redirects from the old WordPress URLs
sitemap.xml, robots.txt
```

## Deploying

1. Create a repository on GitHub. Any name works if you use a custom domain.
   Without a custom domain, naming it `USERNAME.github.io` gives you
   `https://USERNAME.github.io` instead of `https://USERNAME.github.io/repo/`.
2. Push these files to the repository root (not inside a subfolder).
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
3. In the repository: **Settings → Pages → Build and deployment**.
   Source: *Deploy from a branch*. Branch: `main`, folder: `/ (root)`. Save.
4. Wait a minute, then load the URL shown on that page.

## Custom domain

`CNAME` already contains `thedustprotocol.com`. To use it:

1. **Settings → Pages → Custom domain**, enter `thedustprotocol.com`, save.
2. At your DNS provider, replace the records pointing at the current host with:
   - `A` records for the apex `@`: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www`: `USERNAME.github.io`
3. Once DNS has propagated, tick **Enforce HTTPS**.

Do not point DNS at GitHub until the site is pushed and working, or the domain
will be down in between. If you are not using this domain, delete `CNAME`.

## Images

The pages currently load images from the existing WordPress site
(`thedustprotocol.com/wp-content/...`) so it works immediately. **Those links
break the moment WordPress goes away.** Before switching DNS:

1. Download the images and put them in `assets/img/`.
2. Search the HTML files for `wp-content` and replace each URL with a local path,
   e.g. `assets/img/hero.jpg`.
3. Add `assets/img/favicon.png` (a square PNG of the logo, 512×512).
4. Add `assets/img/contact.jpg` — the photo on the contact page. It is cropped
   to 21:9 and desaturated, so a wide image works best.

Resize photos to about 2000px wide and save as JPEG at quality ~80 before
committing — GitHub Pages has no image optimisation.

## Contact address

There is no form. GitHub Pages cannot process one, so the enquiry block on
`about.html` and `contact.html` shows a `mailto:` link instead.

The address is a placeholder. Set `EMAIL` at the top of `build.py` and run
`python3 build.py`, or search the HTML for `hello@example.com` and replace it.

If you would rather have a real form later, point it at a third-party endpoint
(Web3Forms, Formspree, Basin) — the markup is an ordinary `<form>` with their
URL in `action`.

## Adding an event

Edit `assets/js/events.js`:

```js
{
  year: "2026",
  kind: "Performance",          // "Performance" or "Conference"
  name: "Festival name",
  place: "City, Country"
}
```

Newest first. The home page shows the first three; `events.html` shows all and
filters by `kind`.

## Editing text

Open the `.html` file and edit the text between the tags. Each page repeats the
header and footer — if you change the navigation, change it in all five files.

## Notes on what changed from the WordPress site

- Elementor, the theme and all plugins are gone; the pages are hand-written.
- Old URLs `/about-2/`, `/contact-2/` and `/events/` redirect to the new pages,
  so existing links and search results keep working.
- Individual event detail pages (`/portfolios/...`) were not carried over. If
  you want them, each one needs its own HTML file.
- The Google Maps embed on the contact page was replaced with a text location.
  Embedding the map again means loading Google's tracking on every visit.
