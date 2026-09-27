# VERTUS TECHNOLOGY — site corporate

Site vitrine et d’acquisition de prospects, bilingue **français** (langue par défaut, `/`) et **arabe** (RTL, `/ar`) — thème clair par défaut, conforme au cahier des charges web V2.1.
Next.js 16 (App Router), Tailwind CSS v4, React Three Fiber (hero 3D), Swiper.

## Démarrage

```bash
npm install --cache /tmp/npm-cache-vertus
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Variables d’environnement (`.env.local`, jamais commité)

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domaine final (canonical, sitemap, Open Graph). Défaut : `https://www.vertus-technology.com` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL du web app Apps Script qui reçoit les demandes d’étude |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics 4 (`G-XXXX`). Sans lui : pas de bandeau cookies, aucun traceur |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Jeton de vérification Google Search Console (balise meta) |

## Arborescence (15 pages + légales, FR et AR)

Accueil · VERTUS Technology · Solutions · Photovoltaïque · Pompage solaire · Stockage · Mobilité électrique · Ingénierie & Bureau d’études · METAFORM · Réalisations · Expertise · Actualités (+ articles) · FAQ · Contact · Demander une étude · Mentions légales · Politique de confidentialité.
URLs définies dans `src/lib/routes.ts` (mêmes slugs dans les deux langues : français à la racine, arabe sous `/ar` ; les anciennes adresses `/fr/…` redirigent vers la racine).

## Où modifier le contenu

Le contenu est structuré en blocs typés (`src/content/types.ts`), prêt à être branché sur un CMS (Sanity, Decap, Strapi…) :

- `src/content/company.ts` — téléphones, WhatsApp, e-mails, adresse, horaires, réseaux sociaux (champs vides = masqués).
- `src/content/pages.fr.ts` / `pages.ar.ts` — H1, textes, SEO (title/meta) et blocs de chaque page.
- `src/content/ui.ts` — navigation, libellés, formulaire, mot du CEO, bandeau cookies.
- `src/content/projects.ts` — réalisations (**exemples à remplacer** par les vrais projets).
- `src/content/articles.ts` — actualités / articles.
- Images : `public/projects/`, `public/about/`.

## Formulaire « Demander une étude » → Google Sheets (CRM)

Le formulaire (`src/components/blocks/StudyForm.tsx`) envoie les champs du cahier des charges + pièces jointes (PDF/JPG/PNG, 3 × 5 Mo max) à `/api/contact`, qui :

1. valide tout côté serveur (champs obligatoires, e-mail, téléphone, nombres, fichiers, consentement) ;
2. filtre le spam (champ piège invisible, délai minimal de saisie, limite de 5 envois / 10 min / IP) ;
3. ajoute les champs CRM : `id` (ex. `VT-20260926-A1B2C3`), `date`, `status = NEW`, source/UTM, page, langue ;
4. transmet le tout en JSON au web app Apps Script.

Statuts CRM à utiliser dans la colonne `status` : `NEW` → `CONTACTED` → `QUALIFIED` → `STUDY` → `QUOTE_SENT` → `WON` / `LOST` → `FOLLOW-UP`.

### Apps Script à déployer — `scripts/google-apps-script.gs`

Chaque demande devient **une ligne lisible** dans l’onglet « Prospects » (pas de JSON brut) : une colonne par champ avec en-têtes en français, vraies dates et nombres (triables et filtrables), liste déroulante et couleur par statut CRM, pièces jointes enregistrées dans Google Drive (un dossier par demande, liens cliquables), demande la plus récente en haut, colonne « Notes internes » pour l’équipe et e-mail de notification.

1. Google Sheet → Extensions → Apps Script → remplacer tout le code par le contenu de `scripts/google-apps-script.gs`.
2. Choisir la fonction `setup` → **Exécuter** (une seule fois, accepter les autorisations).
3. **Déployer → Gérer les déploiements** → modifier (crayon) → Version : « Nouvelle version » → Déployer. En gardant le même déploiement, l’URL `/exec` (et donc `GOOGLE_SHEETS_WEBHOOK_URL`) ne change pas.

Sans `GOOGLE_SHEETS_WEBHOOK_URL`, les demandes sont seulement écrites dans les logs du serveur.

## Mesure d’audience & conversions

GA4 n’est chargé qu’après acceptation du bandeau cookies. Événements envoyés : `cta_study_click`, `phone_click`, `whatsapp_click`, `email_click`, `form_start`, `generate_lead` (envoi réussi), `form_abandon` (formulaire commencé puis page quittée). Marquer `generate_lead`, `phone_click` et `whatsapp_click` comme conversions dans GA4.

## SEO & technique

Title/meta par page, canonical, hreflang FR/AR, Open Graph, `sitemap.xml`, `robots.txt`, Schema.org (Organization/LocalBusiness, WebSite, Service, BreadcrumbList, FAQPage, Article), page 404 par langue, en-têtes de sécurité (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy), images AVIF/WebP + lazy loading, polices limitées, animations désactivées si « réduire les animations ».

### Images de partage (Open Graph)

Chaque page a sa propre image PNG 1200×630 (titre de la page, FR ou AR), générée au build par `src/app/og/[locale]/[[...slug]]/route.tsx` — ex. `/og/fr/solutions/pompage-solaire`.

### Soumettre le sitemap (après mise en ligne sur le domaine final)

1. Définir `NEXT_PUBLIC_SITE_URL` sur le domaine final, redéployer.
2. [Google Search Console](https://search.google.com/search-console) → Ajouter une propriété (domaine) → vérifier (enregistrement DNS, ou balise via `NEXT_PUBLIC_GSC_VERIFICATION`).
3. Menu **Sitemaps** → saisir `sitemap.xml` → Envoyer. Faire de même dans [Bing Webmaster Tools](https://www.bing.com/webmasters) (import possible depuis Search Console).
4. Tester les aperçus de partage : [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), et les données structurées : [Rich Results Test](https://search.google.com/test/rich-results).

## À compléter avant la mise en ligne

- Mentions légales et politique de confidentialité : champs `[à compléter]` (raison sociale, matricule fiscal, RNE, durée de conservation).
- Horaires, réseaux sociaux, domaine définitif, IDs GA4 / Search Console.
- Réalisations réelles (photos, puissances, résultats) à la place des exemples.
