# septic-quote-request-form

A static, no-backend quote request form for Out West Septic. Drop the directory on any web host (or Netlify, GitHub Pages, Cloudflare Pages). The form opens the user's mail client with a pre-filled message by default. Optional webhook mode for real submissions.

The form is a single HTML page with inline validation and a small JavaScript handler. No build step. No frameworks. No tracking. No cookies.

## What's in it

- `index.html` — the form, with all fields, the OWS branding, and the legal copy
- `styles.css` — the styles, with a rural-Tan palette and mobile-responsive layout
- `script.js` — the form handler (mailto by default, webhook optional)
- `form-config.json` — the recipient email and submit mode (mostly for reference; the JS reads its own constants)

## Run it locally

```
cd septic-quote-request-form
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy it

The form is a static site. Drop the four files on any host. If you're using Netlify, drag the folder onto the Netlify dashboard. If you're using GitHub Pages, commit and push to a repo with Pages enabled. If you're using a S3 bucket, sync the files.

The site has no server-side dependencies, so any host that serves static files works.

## Change the recipient

Open `script.js` and edit:

```js
const MAILTO_RECIPIENT = "outwestseptic@gmail.com";
```

Or switch to webhook mode by setting `SUBMIT_MODE = "webhook"` and `WEBHOOK_URL` to your endpoint. The webhook receives a JSON POST with all the form fields plus a `services` array.

## Form fields

The form collects:

- Name, phone, optional email
- Property address or directions
- County (dropdown of the 7 served) and optional parcel ID
- Service needed (checkboxes: new install, drainfield, perc, site eval, repair, inspection, riser, other)
- Home status (new construction, failed system, no system yet, vacant land, other)
- Bedrooms (for sizing new systems)
- Free-form notes

The county dropdown is hardcoded to the 7 counties we serve: Palo Pinto, Hood, Erath, Stephens, Young, Jack, Eastland. If you expand the service area, add counties to the dropdown in `index.html` and to the `service_area.counties` list in `form-config.json`.

## Branded footer

The footer is:

> Out West Septic, outwestseptic.com, 940.452.0598, TCEQ OSSF Installer I OS0041298, Lone Camp, TX. Serving Palo Pinto, Hood, Erath, Stephens, Young, Jack, and Eastland counties plus Mineral Wells, Graford, Possum Kingdom Lake, and Eastland.

Parker and Tarrant are not in the service area. The hero copy says so.

## License

MIT. See `LICENSE`.
