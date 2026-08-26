# AIFOD — Headless WordPress + Next.js Frontend

Yeh frontend `https://af.net` (AIFOD) WordPress site ko **headless CMS** ke tor par use karta hai. WordPress admin, plugins, content editing sab kuch WordPress mein waisa hi rehta hai — yeh project sirf tez, static/ISR-rendered frontend hai jo WordPress se WPGraphQL ke zariye data leta hai.

## 1. WordPress side setup (ek dafa karna hai)

1. WordPress admin mein **WPGraphQL** plugin install + activate karein.
   https://wordpress.org/plugins/wp-graphql/
2. Agar site par **WPML** ya **Polylang** already multi-language ke liye use ho raha hai, to us plugin ka matching WPGraphQL addon bhi install karein:
   - WPML → `WPGraphQL for WPML`
   - Polylang → `WPGraphQL Polylang`
3. WPGraphQL settings mein CORS/allowed origins mein apni Next.js site ka domain add karein (production domain + `http://localhost:3000` for local dev).
4. Confirm karein ke `https://af.net/graphql` par GraphiQL IDE khul raha hai (WordPress admin → GraphQL → GraphiQL IDE).

Forms (membership signup, speaker application, media requests) **abhi WordPress ki taraf hi redirect** rahenge — unhein alag se migrate karne ki zaroorat nahi (Phase 1 mein).

## 2. Is project ko run karna

```bash
npm install
cp .env.example .env.local
# .env.local mein NEXT_PUBLIC_WORDPRESS_API_URL ko apne asal WPGraphQL endpoint se set karein
npm run dev
```

Site `http://localhost:3000/en` par khulegi (locale-prefixed routes: `/en`, `/ar`, `/fr`, `/ru`, `/es`, `/zh`).

## 3. Architecture

- **`src/app/[locale]/`** — har page locale-prefixed hai (`/en/about`, `/fr/about`, ...).
- **`src/app/[locale]/[slug]/page.tsx`** — koi bhi WordPress **Page** (About, Membership, summit pages: Nairobi/Geneva/Vienna/Bangkok) automatically render hota hai uske WordPress `content` (raw HTML) se — jo already publish hai wahi dikhta hai.
- **`src/app/[locale]/news/`** — Blog/News listing aur single post pages.
- **`src/lib/queries.ts`** — WPGraphQL queries (menu, pages, posts).
- **ISR (`revalidate = 300`)** — pages static/cached serve hote hain (fast!) aur background mein har 5 min refresh hote hain, taake WordPress mein content update karne par site ko rebuild na karna pare.

## 4. Abhi tak jo cheez asal design match nahi karti

Yeh scaffold **functionally** headless hai (real WordPress data fetch karta hai, i18n routing, ISR speed) lekin abhi **generic/minimal styling** use ho rahi hai — asal AIFOD theme ka CSS/JS is mein port nahi hua, kyunke woh sirf live site dekh kar guess nahi kiya ja sakta (theme files/design assets chahiye honge).

**Agla step (pixel-parity ke liye):** current WordPress theme ke CSS/fonts/components ko dekh kar (ya theme files access karke) Header/Footer/page components ko match kiya jaye, taake visitors ko farq mehsoos na ho — sirf speed mein farq nazar aaye.

## 5. Deployment

- **Frontend:** Vercel par deploy karein (free tier + global CDN = sabse fast).
- **Backend:** WordPress apni current hosting par hi rahega, sirf API serve karega.
- DNS: `af.net` ko Next.js/Vercel par point karein, aur WordPress ko `cms.af.net` ya `admin.af.net` jaisay subdomain par move kar dein taake admin alag rahe.
