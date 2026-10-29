# Golden Fenix Renovations website

The one-page website for Golden Fenix Renovations, home renovation specialists in Vancouver and the Lower Mainland.

It is a plain static site: no build step, no frameworks, nothing to install.

| File | What it is |
| --- | --- |
| `index.html` | All the page content and text |
| `styles.css` | Colours, fonts, sizes and layout |
| `script.js` | Small extras: header on scroll, fade-ins, service panels, quote form |
| `gfenix/` | Logo, crown watermark and project photos |
| `404.html` | "Page not found" page |
| `robots.txt` | Tells search engines they may index the site |

## Preview on your computer

Open a terminal in this folder and run:

```
python3 -m http.server
```

Then visit <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop it.

## Put it online

Upload the whole folder as it is. There is nothing to build.

- **Netlify**: go to app.netlify.com, choose "Add new site → Deploy manually", and drag this folder onto the page.
- **Vercel**: create a new project from this folder or its GitHub repo. Set "Framework preset" to *Other* and leave the build command empty.
- **GitHub Pages**: push this folder to a GitHub repo, then go to *Settings → Pages* and choose "Deploy from a branch", branch `main`, folder `/ (root)`.

  Note: `404.html` uses links that start with `/`. These work on a custom domain (or `username.github.io`). If the site lives at `username.github.io/repo-name/`, remove the leading `/` from the links in `404.html`.

Once the site has its real web address, open `index.html` and fill in the address in the commented-out `canonical` and `og:url` lines near the top, and add a `"url"` line to the business details block (it is the `application/ld+json` part).

## Editing text and the phone number

All text is in `index.html`. Search for the words you want to change and edit them between the tags.

The phone number appears in several places. Search `index.html` (and `404.html`) for **`236-512-8418`** to find the visible number, and for **`12365128418`** to find the links that make phones dial it (`tel:12365128418`). The business details block near the top also has `"telephone": "+1-236-512-8418"`. Update all of them.

Colours and fonts are listed at the top of `styles.css`.

## Hooking up the quote form

The site has no server of its own, so the form needs a form service to receive the requests and email them to you. [Formspree](https://formspree.io) is a simple option; Basin and Getform work the same way.

1. Create a free account and a new form. You will get a URL such as `https://formspree.io/f/abcdwxyz`.
2. Open `script.js` and paste it at the top:

   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```

3. Upload the site again and send yourself a test request.

What gets sent: `name`, `phone`, `email`, `message`, and `project_type` (the buttons the visitor picked, such as "Home renovation, Deck").

- **While `FORM_ENDPOINT` is empty** (as it is now), pressing "Request a quote" shows the thank-you message but **nothing is sent anywhere**. A warning appears in the browser console as a reminder.
- **If sending fails**, a red message under the button asks the visitor to try again or call.
