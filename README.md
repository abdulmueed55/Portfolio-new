# AIFOD — Headless WordPress + Next.js Frontend

Yeh frontend `https://af.net` (AIFOD) WordPress site ko **headless CMS** ke tor par use karta hai. WordPress admin, plugins, content editing sab kuch WordPress mein waisa hi rehta hai — yeh project sirf tez, static/ISR-rendered frontend hai jo WordPress se REST API ke zariye data leta hai.

## 1. WordPress side setup

Koi naya plugin install karne ki zaroorat nahi — af.net ke `kadence-child` theme mein **pehle se hi ek working REST API config** maujood hai (`rest-api-config.php`, React Native app ke liye bana tha):

- CORS already `*` (open) hai
- `plain_excerpt`, `reading_time`, `featured_image_urls` jaisi extra fields already posts ke saath aati hain
- Yeh sab `https://af.net/wp-json/wp/v2/...` par already live hai

Sirf yeh confirm karna hai:

1. Agar site par **WPML** ya **Polylang** multi-language ke liye active hai, confirm karein ke uska REST API language support **on** hai (dono plugins `?lang=en` jaisa query param support karte hain jab yeh enable ho) — is project ka code isi convention par based hai (`src/lib/queries.ts` mein `langParam()`).
2. `https://af.net/wp-json/wp/v2/posts` khol kar dekh lein data aa raha hai ya nahi.

Forms (membership signup, speaker application, media requests) **abhi WordPress ki taraf hi redirect** rahenge — unhein alag se migrate karne ki zaroorat nahi (Phase 1 mein).

## 2. Is project ko run karna

```bash
npm install
cp .env.example .env.local
# .env.local mein NEXT_PUBLIC_WORDPRESS_API_URL ko https://af.net/wp-json par set karein
npm run dev
```

Site `http://localhost:3000/en` par khulegi (locale-prefixed routes: `/en`, `/ar`, `/fr`, `/ru`, `/es`, `/zh`).

## 3. Architecture

- **`src/app/[locale]/`** — har page locale-prefixed hai (`/en/about`, `/fr/about`, ...).
- **`src/app/[locale]/[slug]/page.tsx`** — koi bhi WordPress **Page** (About, Membership, summit pages: Nairobi/Geneva/Vienna/Bangkok) automatically render hota hai uske WordPress `content` (raw HTML) se — jo already publish hai wahi dikhta hai.
- **`src/app/[locale]/news/`** — Blog/News listing aur single post pages.
- **`src/lib/queries.ts`** — REST API calls (`/wp/v2/pages`, `/wp/v2/posts`). Primary nav menu abhi hardcoded hai (core REST API menu expose nahi karta) — agar WordPress mein nav change ho, yahan bhi update karna hoga.
- **ISR (`revalidate = 300`)** — pages static/cached serve hote hain (fast!) aur background mein har 5 min refresh hote hain, taake WordPress mein content update karne par site ko rebuild na karna pare.

### Custom post types abhi shamil nahi

Theme files se yeh bhi pata chala ke af.net par 3 custom post types hain jo membership system ka hissa hain:
- `member_payment` — invoices/renewals
- `member_certificate` — certificates
- `ai_news` — AI news content type

Yeh abhi is frontend mein query/render nahi ho rahe — pehle standard pages/news chalayenge, phir inhein add karenge.

## 4. Design status

Real colors/fonts/button-styles af.net ki live site se nikaal kar already wire kar diye hain (dekhen `design-reference/README.md`) — pink `#E21E51`, navy `#000b33`, Lexend/Montserrat fonts, pill-shaped buttons. Lekin har page ka **exact layout** (hero sections, cards, grids) abhi generic hai — yeh page-by-page match karna baaki hai jaise real content aana shuru hoga.

## 5. Deployment

- **Frontend:** Vercel par deploy karein (free tier + global CDN = sabse fast).
- **Backend:** WordPress apni current hosting par hi rahega, sirf API serve karega.
- DNS: `af.net` ko Next.js/Vercel par point karein, aur WordPress ko `cms.af.net` ya `admin.af.net` jaisay subdomain par move kar dein taake admin alag rahe. **Yeh sirf boss approval ke baad hoga.**
