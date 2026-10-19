# Rachel Fragrance Catalog

An English-language, U.S.-focused perfume catalog built with Next.js. This version exports static HTML, CSS, and JavaScript for GitHub Pages at `https://rachel00508.github.io/Rachel_web/`.

## What the public site does

- Shows the home, fragrance catalog, product details, bag, story, contact, and site guide pages.
- Displays four user-selected fragrances at the requested USD prices.
- Saves bag selections in the visitor's own browser. There is **no checkout, payment, order submission, shipping, or contact form**.
- Uses original scent illustrations for the four branded fragrances. They are not photographs of the actual bottles or packaging. Product descriptions and brand story are demonstration content.

| Fragrance | Size | Display price |
|---|---:|---:|
| 爱马仕尼罗河花园 · Hermès Un Jardin sur le Nil | 50 ml | $250 |
| 祖·玛珑鼠尾草与海盐 · Jo Malone Wood Sage & Sea Salt | 100 ml | $500 |
| 阿玛尼高定私藏御龙茶香 · Armani Privé Thé Yulong | 50 ml | $200 |
| 范思哲粉钻 · Versace Bright Crystal | 50 ml | $188 |

## Deploy to GitHub Pages

The repository is `Rachel00508/Rachel_web`. The workflow at `.github/workflows/deploy-pages.yml` builds the site on every push to `main` and publishes the generated `out` directory. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. The site URL will be `https://rachel00508.github.io/Rachel_web/` after the workflow succeeds. No environment variables or external service accounts are needed.

The workflow sets `GITHUB_PAGES=true` and `NEXT_PUBLIC_BASE_PATH=/Rachel_web` so that Next.js links and product images work from the repository subpath. If the repository name changes, update both values in the workflow and the `basePath` in `next.config.ts`.

## Run locally

Use Node.js 20+ and pnpm:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/`. Local development has no `/Rachel_web` prefix. To reproduce the Pages export locally:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/Rachel_web pnpm build
```

On Windows PowerShell, set those two variables with `$env:GITHUB_PAGES='true'` and `$env:NEXT_PUBLIC_BASE_PATH='/Rachel_web'` before `pnpm build`.

To change products or prices, edit `lib/demo.ts` and the published slug list in `lib/catalog.ts`, then push to `main`. Confirm product identity, stock, imagery rights, and actual prices before presenting the catalog as a live store. Add a real contact channel and commerce backend before accepting orders.
