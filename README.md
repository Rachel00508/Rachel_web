# Rachel Parfums

An English language, U.S. focused perfume storefront built with Next.js App Router, Supabase and Stripe Checkout test mode. Product copy, bottle illustrations and brand story are **demo content**.

## Deploy from GitHub (`Rachel_web`) to Vercel

This is a Next.js application, not a collection of standalone HTML and CSS files. GitHub stores the source; Vercel runs the pages and the server routes needed for checkout, Stripe webhooks, and the contact form. Do not select GitHub Pages for this version.

1. Create a GitHub repository named `Rachel_web`. Put the **contents of this `perfume` folder at the repository root**. If you instead push the entire parent workspace, set Vercel's **Root Directory** to `perfume`.
2. From this folder, run the commands below, replacing `<your-github-username>` with your actual GitHub username. If the folder is already a Git repository, skip `git init` and use its existing remote as appropriate.

   ```bash
   git init
   git add .
   git commit -m "Prepare Rachel storefront for deployment"
   git branch -M main
   git remote add origin https://github.com/<your-github-username>/Rachel_web.git
   git push -u origin main
   ```

3. In [Vercel](https://vercel.com/new), import the `Rachel_web` repository. Select **Next.js** as the framework and leave the default build command (`next build`) and output settings. Vercel will install dependencies from `pnpm-lock.yaml`. Do not use a static export setting.
4. Run `supabase/schema.sql` in your Supabase project's SQL Editor. In Vercel **Project Settings → Environment Variables**, set the following for the deployment environment:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | The final site origin, for example `https://your-domain.example` (no path or trailing slash) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key; server only |
   | `STRIPE_SECRET_KEY` | Stripe **test** secret key (`sk_test_...`) |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`), set after creating the endpoint |

5. Deploy once to obtain the Vercel URL. Set `NEXT_PUBLIC_SITE_URL` to the domain you will actually use, then redeploy. In Stripe **test mode**, create a webhook endpoint at `https://YOUR-DOMAIN/api/stripe/webhook` and subscribe to `checkout.session.completed`. Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy again. If the domain changes, update both `NEXT_PUBLIC_SITE_URL` and the Stripe endpoint.
6. Open the deployed `/shop`, `/cart`, and `/contact` pages. Place a test order and verify the `orders` row after the webhook arrives. Check `contact_messages` after a form submission.

Never add real keys to GitHub or commit `.env.local`; `.gitignore` excludes local environment files, build output, and logs. Vercel can show the storefront with local demo products before Supabase is configured, but checkout and contact submission require the environment variables above. This site remains a **test-mode demo** until the launch requirements below are completed.

## Requirements

- Node.js 20+
- pnpm
- A Supabase project
- A Stripe account with test mode enabled

## Setup

1. Run `pnpm install`.
2. Run `supabase/schema.sql` in the Supabase SQL Editor. It creates the tables and seeds the Rachel demo products plus four curated branded fragrances. Re-running the script updates the four curated products to the prices below.
3. Copy `.env.example` to `.env.local` and enter your Supabase URL, anon key and service role key, plus Stripe **test** secret key.
4. Set `NEXT_PUBLIC_SITE_URL` to the origin where the site runs, such as `http://localhost:3000`.
5. Start the app with `pnpm dev`.
6. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a separate terminal, then copy its `whsec_...` secret to `.env.local` and restart the app.

The site can render with illustrative local products before Supabase is configured. Checkout and the contact form require live Supabase credentials; checkout also requires Stripe credentials. Product prices and availability are always checked against Supabase on the server before a Stripe session is created.

## Curated products added

| Product | Size | User-provided USD price |
|---|---:|---:|
| 爱马仕尼罗河花园 · Hermès Un Jardin sur le Nil | 50 ml | $250 |
| 祖·玛珑鼠尾草与海盐 · Jo Malone Wood Sage & Sea Salt | 100 ml | $500 |
| 阿玛尼高定私藏御龙茶香 · Armani Privé Thé Yulong | 50 ml | $200 |
| 范思哲粉钻 · Versace Bright Crystal | 50 ml | $188 |

The four images in `public/products/` are original generated scent illustrations. They are **not photographs of the branded bottles or packaging**. Verify stock, authenticity, exact variant and fulfillment capability before offering them for sale. Product note descriptions were checked against [Hermès](https://www.hermes.com/be/fr/product/un-jardin-sur-le-nil-eau-de-toilette-V20397/), [Jo Malone London](https://www.jomalone.com/scents/woody/wood-sage-sea-salt), [Armani Beauty](https://www.giorgioarmanibeauty-usa.com/fragrances/armani-prive/les-eaux/the-yulong/A2254.html) and [Versace](https://www.versace.com/us/en/bright-crystal-edt-50-ml/R510030-R050MLS.html). Prices are the user's requested values, not manufacturer prices.

## Test the flow

Add a fragrance to the bag, adjust quantity, refresh and confirm the bag persists. Complete Stripe Checkout with the test card `4242 4242 4242 4242`, any future expiry and any CVC. Confirm a row appears in `orders` after `checkout.session.completed`; repeat the webhook event and confirm there is still one row for that session. Cancel checkout and confirm the bag remains. Disable a product in Supabase and confirm it disappears from the catalog; a saved bag shows it as unavailable. Submit the contact form and confirm a row appears in `contact_messages`.

## Data and access

`products` has a public read policy for active rows. `orders` and `contact_messages` have RLS enabled with no public policies; only server routes using `SUPABASE_SERVICE_ROLE_KEY` can write them. Never put the service role key or Stripe secret in a `NEXT_PUBLIC_` variable. Edit products through the Supabase dashboard; this project has no admin interface.

## Demo boundaries

Checkout accepts U.S. shipping addresses only, charges USD, offers free demo shipping, and does not calculate tax. There is no fulfillment, refund workflow or notification email. Replace the illustrative product imagery, copy, contact address and brand story before launch. Add real shipping, tax, privacy, returns and other required store policies before enabling live Stripe keys.
