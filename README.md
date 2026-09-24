# VERTUS TECHNOLOGY — site corporate

Site vitrine bilingue (FR par défaut, AR en RTL réel sur `/ar`) construit avec
Next.js (App Router), Tailwind CSS v4, React Three Fiber et Framer Motion.

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000  (arabe : /ar)
npm run build    # build de production
```

## Où modifier le contenu

Tout le contenu éditable est centralisé — aucun composant à toucher :

| Fichier | Contenu |
|---|---|
| `src/content/site.ts` | Coordonnées société, réseaux sociaux, **tous les textes FR et AR** (nav, hero, solutions, projets, témoignages, fondateur, formulaire, SEO…) |
| `src/lib/seo.ts` | Construction des métadonnées + JSON-LD (Organization, LocalBusiness, WebSite, Service, BreadcrumbList) |
| `public/logo-mark.svg`, `public/icon.svg`, `public/og.svg` | Logo, favicon, image Open Graph |
| `src/components/Visual.tsx` | Illustrations procédurales des projets — à remplacer par de vraies photos (`next/image`) quand elles seront disponibles |

## Intégration Google Sheets (formulaire de contact)

Le formulaire poste vers `/api/contact` (côté serveur — aucune clé Google
n'est exposée au navigateur), qui transmet à un endpoint Google Apps Script.

1. Créez une feuille Google Sheets avec les en-têtes :
   `Date | Prénom | Nom | Email | Téléphone | Entreprise | Type de projet | Message`
2. Extensions → Apps Script, collez :

```js
function doPost(e) {
  const row = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    row.date, row.firstName, row.lastName, row.email,
    row.phone, row.company, row.projectType, row.message,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Déployer → Nouvelle déploiement → **Application web** → accès :
   « Tout le monde » → copiez l'URL `…/exec`.
4. Dans `.env.local` :

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
```

Sans cette variable, l'API accepte les soumissions et les journalise côté
serveur (utile en développement) sans les perdre silencieusement en erreur.

## Performance & accessibilité

- La scène 3D est chargée dynamiquement, mise en pause hors écran, réduite
  sur mobile/CPU faibles, et remplacée par un visuel statique si WebGL est
  indisponible ou si `prefers-reduced-motion` est actif.
- RTL réel : deux root layouts (`(fr)` / `(ar)`) fixent `lang` et `dir` ;
  les mises en page utilisent des propriétés logiques (`ms-`, `start-`…).
- SEO : métadonnées par langue, `hreflang`, sitemap, robots, JSON-LD.
# vertus-technology
