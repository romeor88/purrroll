# Deploy PurrRoll on Netlify

1. Push or upload the full project to Netlify. The root `netlify.toml` already
   contains the build, publish, function, and single-page routing settings.
2. In **Site configuration → Environment variables**, add:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_ENVIRONMENT` with `sandbox` while testing, then `live` for real orders
3. Deploy the site.
4. Run a PayPal sandbox purchase before switching to live credentials.

The browser never receives the PayPal secret. The Netlify function validates the
bundle and selected colors, recalculates the official price, creates the PayPal
order, and captures it after approval.

