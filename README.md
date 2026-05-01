# dripp

Animated sneaker showcase rebuilt with React and Next.js.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin

The admin panel is available from the `ADMIN` nav button. For now, everyone can open it because this is a student/dev build.

The backend credential check lives in `app/api/auth/route.js`.

Default credentials:

```txt
username: admin
password: dripp123
```

To change them without editing code later, set environment variables:

```txt
ADMIN_USERNAME=yourname
ADMIN_PASSWORD=yourpassword
```

## Shoe Data

Shoes are stored in `data/shoes.json` and managed through these Next.js API routes:

- `GET /api/shoes`
- `POST /api/shoes`
- `PUT /api/shoes/:id`
- `DELETE /api/shoes/:id`

This file-backed storage is good for local development. For real deployment, use a free hosted database because serverless hosts usually do not keep file changes forever.

## Free Asset Hosting Options

- Cloudinary free tier: best free choice for shoe photos, transformations, and optimized delivery.
- Supabase Storage free tier: good if you also use Supabase as your database.
- Firebase Storage free tier: useful if you already use Firebase.
- GitHub repository `public` folder: fine for small student projects, but not ideal for frequent admin uploads.

For a deployed version, a practical free stack is Vercel for the Next.js app, Supabase for shoe records, and Cloudinary for images.

## Free Hosting Plan

Recommended student setup:

```txt
GitHub      = your code backup and version history
Vercel      = hosts the Next.js website and backend API routes
Supabase    = stores shoe data later instead of data/shoes.json
Cloudinary  = stores optimized shoe photos and logos
```

Why this split works:

- GitHub is not the live app. It stores your code and lets Vercel pull every update.
- Vercel is the live website. It runs the React frontend and Next.js backend routes.
- Supabase should become the database when you deploy seriously. The current `data/shoes.json` file is fine locally, but file edits are not reliable on serverless hosting.
- Cloudinary should hold product photos, because image URLs stay stable and images can be optimized without you paying for storage at the start.

Useful official docs:

- Vercel pricing and Hobby plan: https://vercel.com/docs/pricing
- Vercel Git deployments: https://vercel.com/docs/deployments/deployment-methods
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Supabase billing/free plan overview: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase Storage: https://supabase.com/docs/guides/storage
- Cloudinary pricing/free plan: https://cloudinary.com/pricing/compare-plans
- Cloudinary uploads: https://cloudinary.com/documentation/upload_images
- GitHub existing project guide: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github

## Upload To GitHub

1. Create a new GitHub repository named `dripp`.
2. Do not add a README/license/gitignore on GitHub if this local repo already has them.
3. In this project folder, run:

```bash
git add .
git commit -m "Rebuild dripp with Next.js"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dripp.git
git push -u origin main
```

If `origin` already exists, use:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/dripp.git
git push -u origin main
```

What to upload:

- Upload/commit `app`, `lib`, `data`, `public`, `package.json`, `package-lock.json`, `next.config.mjs`, `eslint.config.mjs`, `.gitignore`, and `README.md`.
- Do not upload `node_modules`.
- Do not upload `.next`.
- Do not upload `.env.local` if you add one later.

## Deploy On Vercel

1. Go to Vercel and sign in with GitHub.
2. Click `Add New Project`.
3. Import the `dripp` GitHub repository.
4. Framework should auto-detect as Next.js.
5. Build command can stay `npm run build`.
6. Install command can stay `npm install`.
7. Add environment variables before production:

```txt
ADMIN_USERNAME=your-admin-name
ADMIN_PASSWORD=your-strong-password
```

8. Deploy.

After this, every `git push` to GitHub will trigger a new Vercel deployment.

Important: the admin panel currently writes to `data/shoes.json`. That is good for learning and local dev. For a real hosted admin panel, move shoe data to Supabase so added shoes stay saved after deployments/server restarts.

## How The Services Work Together

Normal visitor flow:

```txt
Visitor opens Vercel URL
Vercel serves Next.js page
Page asks /api/shoes for shoe data
API returns shoe records
Images load from /public now, or Cloudinary later
```

Future production admin flow:

```txt
You open Account > Admin
You add a shoe
Next.js API receives the form
API saves text/colors/zoom to Supabase
Image field stores a Cloudinary URL
Website immediately reads the new shoe from Supabase
```

## Admin Panel Fields

- `id`: unique URL/code-style name, like `air-force-1`. Do not change this while editing an existing shoe.
- `shoe name`: big display title.
- `brand`: text brand name, used when no brand logo is provided.
- `description`: short main line under the brand strip.
- `image URL`: local path or hosted URL for the shoe image.
- `brand logo URL`: optional image for Nike/adidas/etc. Leave blank to show brand text.
- `background`: full slide background color.
- `title color`: color of the big shoe-name text.
- `brand strip`: color behind the company name/logo. The navbar also follows this color.
- `desc color`: color for the small description text.
- `image zoom`: manual shoe scale. `1` is normal, `1.2` is 20% larger, `0.8` is smaller.
- `image y`: vertical offset. Negative moves the shoe up, positive moves it down.
- `shoe zoom` slider: easier manual version of `image zoom`.
- `shoe area`: desktop width given to the shoe side before expansion. Text gets the remaining width.
- `image fit`: `contain` keeps the whole shoe visible; `cover` fills the box and can crop.

## Manual Style Tweaks

To change the top-left `dripp` logo size, edit `.drippName` in `app/globals.css`:

```css
font-size: clamp(68px, 9.6vw, 96px);
```

Increase the last value for a bigger desktop logo, or the first value for a bigger mobile minimum.

To change the default shoe/text width balance in code, edit `.shoePic` and `.shoeInfo`, or use `shoe area` in the admin panel per shoe:

```css
.shoePic {
  width: 58%;
}

.shoeInfo {
  width: 42%;
}
```

Make `.shoePic` larger for more shoe space, and reduce `.shoeInfo` by the same amount. The two should add up to `100%`.

## General Tips

- Keep product images as transparent PNG/WebP when possible so the poster-style layouts stay clean.
- Use consistent image sizes and crop direction; the admin `imageScale` and `imageOffsetY` fields are there for quick layout tuning.
- Do not commit secret passwords. Use environment variables before sharing a deployed admin panel.
- Keep font licenses in mind if you publish commercially.
- When the app grows, replace `data/shoes.json` with a real database table.
