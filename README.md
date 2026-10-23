# Le Portail — site du salon de coiffure (Fribourg)

Site vitrine statique (HTML, CSS, JavaScript natif) pour **Le Portail**, salon de coiffure à la Grand-Rue 46, 1700 Fribourg.
Conçu pour être hébergé gratuitement sur **GitHub Pages**, sans aucune étape de compilation.

Objectif principal du site : **faire appeler le salon pour prendre rendez-vous.**

---

## 1. Arborescence

```
/
├── index.html               Page d'accueil (français)
├── en/
│   └── index.html           Version anglaise (clientèle expatriée)
├── mentions-legales.html    Mentions légales et confidentialité
├── css/
│   └── style.css            Feuille de style unique (variables en tête de fichier)
├── js/
│   └── script.js            Menu mobile, statut « ouvert / fermé », animations
├── assets/
│   ├── fonts/               Fraunces + DM Sans (woff2, hébergées localement)
│   ├── icons/
│   │   └── apple-touch-icon.png
│   └── images/
│       └── og-image.png     Image d'aperçu pour les partages (1200 × 630)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll                Désactive le traitement Jekyll de GitHub Pages
└── README.md
```

Aucune dépendance externe : pas de framework, pas de CDN, pas de Google Fonts en ligne, pas de traceur.

---

## 2. Fonctionnement du site

Une page unique par langue, structurée selon le parcours d'un client :

| Section | Rôle |
|---|---|
| En-tête | Logo, navigation par ancres, bascule FR/EN, bouton d'appel (ordinateur) |
| Accueil | Ce qu'est le salon, où il se trouve, bouton « Prendre rendez-vous » (appel), statut d'ouverture en direct, note Google |
| Atouts | Les 4 points forts vérifiés : accueil, conseil couleur, kératine, anglais parlé |
| Prestations | Les 4 prestations confirmées par les avis + encadré « Tarifs sur demande » |
| Le salon | Présentation courte et faits pratiques |
| Avis | Note 5,0 / 167 avis, synthèse des thèmes récurrents, lien vers les avis Google et vers Instagram |
| Horaires & accès | Tableau des horaires (jour courant mis en évidence), adresse, boutons Appeler / Itinéraire |
| Pied de page | Rappel d'appel, coordonnées, liens légaux |
| Barre mobile | Barre fixe en bas d'écran sur smartphone : « Appeler le salon » + « Itinéraire » |

### Fonctionnalités opérationnelles

- **Appel en un geste** : tous les boutons d'appel utilisent `tel:+41772694611`.
- **Itinéraire** : ouvre Google Maps avec l'adresse comme destination.
- **Statut d'ouverture en direct** (« Ouvert maintenant · jusqu'à 18h30 », « Fermé · ouvre lundi à 9h00 »), calculé à l'heure de Zurich quel que soit le fuseau du visiteur. Masqué si JavaScript est désactivé.
- **Jour courant** mis en évidence dans le tableau des horaires, avec une étiquette texte (pas seulement une couleur).
- **Menu mobile** accessible : `aria-expanded`, fermeture par Échap, clic extérieur ou choix d'un lien, retour du focus.
- **Sans JavaScript**, le site reste entièrement lisible et utilisable (navigation affichée en liste, aucun contenu masqué).
- **Animations** discrètes à l'apparition des sections, désactivées si le visiteur a demandé de réduire les animations.

---

## 3. Modifier le contenu

Tout se modifie directement dans les fichiers HTML ; aucun outil n'est nécessaire.

### Horaires (à 3 endroits par langue)
1. Tableau `data-hours` dans `index.html` et `en/index.html` :
   ```html
   <tr data-day="6" data-open="09:00" data-close="16:00"><th scope="row">Samedi</th><td>9h00 – 16h00</td></tr>
   ```
   `data-day` : 1 = lundi … 7 = dimanche. Les attributs `data-open` / `data-close` (format `HH:MM`) alimentent le statut « ouvert / fermé ». Jour fermé : retirer ces deux attributs et ajouter `class="is-closed"`.
2. Le résumé dans le pied de page (« Lundi – vendredi, 9h00 – 18h30 »).
3. Les données structurées `openingHoursSpecification` dans le `<head>` de `index.html`.

Pour une pause de midi, le script ne gère qu'une plage par jour : à adapter si nécessaire.

### Téléphone
Rechercher/remplacer `+41772694611` (liens) et `077 269 46 11` / `+41 77 269 46 11` (texte affiché).

### Note Google
La note et le nombre d'avis (« 5,0 » et « 167 ») sont écrits en dur : à mettre à jour de temps en temps
(rechercher `167` dans les deux pages).

### Couleurs et typographie
Toutes les valeurs sont dans les variables CSS en tête de `css/style.css` (`--c-forest`, `--c-terracotta`, etc.).

### Ajouter une vraie photo dans l'arche de l'accueil
Placer une photo (format portrait, ~900 × 1125 px, en `.webp` ou `.jpg` < 150 Ko) dans `assets/images/`, puis dans `.portal` :
```html
<div class="portal">
  <img src="assets/images/salon.webp" alt="Intérieur du salon Le Portail" width="900" height="1125" fetchpriority="high">
</div>
```
(supprimer `role="img"`, `aria-label` et le bloc `.portal-plaque`). Le style est déjà prévu (`.portal > img`). Dans `en/index.html`, le chemin devient `../assets/images/salon.webp`.

---

## 4. Publication sur GitHub Pages

1. Créer un dépôt public sur GitHub (ex. `le-portail`).
2. Y envoyer **le contenu de ce dossier** (le fichier `index.html` doit être à la racine du dépôt) :
   ```bash
   git init
   git add .
   git commit -m "Site Le Portail"
   git branch -M main
   git remote add origin https://github.com/UTILISATEUR/le-portail.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : « Deploy from a branch »**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après 1 à 2 minutes, le site est en ligne à `https://UTILISATEUR.github.io/le-portail/`.

Tous les chemins sont relatifs : le site fonctionne dans ce sous-dossier (testé, voir § 7) comme à la racine d'un domaine personnalisé.

### Nom de domaine `le-portail.ch`

Les balises `canonical`, `hreflang`, Open Graph, le `sitemap.xml` et le `robots.txt` pointent vers **`https://le-portail.ch/`**.

- **Si le salon détient le domaine** (vérifier sur [nic.ch](https://www.nic.ch/fr/whois/) ou auprès de son registraire) :
  1. GitHub : **Settings → Pages → Custom domain** → `le-portail.ch` (GitHub crée le fichier `CNAME`), puis cocher **Enforce HTTPS** une fois le certificat émis.
  2. Chez le registraire, zone DNS : quatre enregistrements `A` pour `le-portail.ch` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, et un `CNAME` `www` → `UTILISATEUR.github.io`.
  3. Coût : 0 CHF côté GitHub ; seul le renouvellement annuel du domaine reste payant.
- **Si le domaine n'est pas disponible** : remplacer `https://le-portail.ch/` par l'adresse réelle (`https://UTILISATEUR.github.io/le-portail/`) dans les 3 fichiers HTML, `sitemap.xml` et `robots.txt` (rechercher/remplacer). Sinon Google recevrait une adresse canonique erronée.

> Remarque : lors de l'analyse (23.10.2026), `le-portail.ch` ne répondait pas depuis notre environnement (échec de résolution DNS). À vérifier dans un navigateur.

---

## 5. Checklist après publication

- [ ] La page s'ouvre sur l'adresse publique, en FR et en EN (`/en/`).
- [ ] Le logo, les polices (titres à empattements) et l'icône d'onglet s'affichent.
- [ ] Sur smartphone : la barre « Appeler le salon » lance bien l'appel ; « Itinéraire » ouvre Google Maps.
- [ ] Le statut « Ouvert / Fermé » correspond à l'heure réelle.
- [ ] Le lien « Lire les avis sur Google » arrive sur la bonne fiche du salon (sinon, remplacer par le lien « Partager » de la fiche Google Maps).
- [ ] Partager l'adresse dans WhatsApp : l'aperçu (image + titre) apparaît.
- [ ] Tester sur [PageSpeed Insights](https://pagespeed.web.dev/) (performances, accessibilité, SEO).
- [ ] Déclarer le site dans [Google Search Console](https://search.google.com/search-console) et y soumettre `sitemap.xml`.
- [ ] **Ajouter l'adresse du site dans la fiche Google Business Profile** du salon (levier n° 1 du référencement local) et dans la bio Instagram.

---

## 6. Informations manquantes / à valider avec le salon

Le site n'invente aucune information. Les éléments suivants restent à obtenir :

| Élément | Situation actuelle sur le site |
|---|---|
| **Horaires** | Lun–ven 9h00–18h30, sam–dim fermé (source : Google, *à confirmer*) |
| **Tarifs** | « Communiqués par téléphone ». Une grille de prix augmenterait la conversion. |
| **Liste complète des prestations** | 4 prestations déduites des avis. Coupe homme/enfant : renvoi au téléphone. |
| **Logo officiel et couleurs** | Logo provisoire (arche typographique) créé pour le site. À remplacer si le salon a un logo. |
| **Photos authentiques** | Aucune. L'arche de l'accueil est une composition graphique, pas une photo. Prévoir 3–6 photos (salon, devanture, réalisations) → voir § 3. |
| **Équipe** | Sophie est citée dans de nombreux avis, mais son rôle n'est pas confirmé : non mentionnée sur le site. Une courte présentation de l'équipe (avec accord) renforcerait la confiance. |
| **E-mail** | Inconnu, donc absent du site. |
| **WhatsApp / réservation en ligne** | Non configurés. Si le salon le souhaite : lien `https://wa.me/41772694611` ou outil de réservation (agenda.ch, Salonkee, etc.). |
| **Raison sociale / responsable** | À ajouter dans `mentions-legales.html` (nom de l'exploitant, éventuel n° IDE). |
| **Domaine `le-portail.ch`** | Propriétaire à vérifier (voir § 4). |

---

## 7. Tests effectués (23.10.2026)

Tests réels, réalisés sur un serveur local servant le site **dans un sous-dossier** `/le-portail/` (même situation que `UTILISATEUR.github.io/le-portail/`), avec le navigateur intégré (moteur Chromium) :

| Test | Résultat |
|---|---|
| Ressources locales (CSS, JS, polices, icônes, liens internes) des 3 pages | Toutes en 200, aucune 404 |
| Ancres internes et icônes du sprite SVG | Toutes résolues |
| Balisage HTML (équilibre des balises, ids uniques) | OK (script de contrôle maison, ce n'est pas le validateur W3C) |
| JSON-LD `HairSalon` | JSON valide |
| Liens externes (Google Maps, Instagram, GitHub) | HTTP 200 |
| Débordement horizontal à 320, 375, 390, 768, 1024, 1440 px (3 pages) | Aucun, après correction de la barre mobile à 320 px |
| Menu mobile (ouverture, Échap, `aria-expanded`, retour du focus) | OK |
| Navigation clavier (lien d'évitement, ordre, focus visible) | OK |
| Statut d'ouverture : 7 scénarios simulés (samedi, vendredi soir, lundi avant 9h, dimanche, 18h29 / 18h30, changement d'heure) | Messages corrects |
| Console JavaScript | Aucune erreur |
| Contrastes des couleurs du thème (calcul WCAG) | Tous ≥ 4,5:1 (AA) |
| Poids de la page d'accueil (transfert compressé) | ≈ 227 Ko en 7 requêtes, dont 211 Ko de polices |

**Non testés** : Lighthouse / PageSpeed (Node.js indisponible ici, à lancer après publication), Safari iOS et Firefox réels, lecteurs d'écran (VoiceOver, NVDA), validateur W3C en ligne, comportement réel des liens `tel:` sur un téléphone.

---

## 8. Limitations connues

- **Pas de formulaire de contact** : aucun e-mail connu et GitHub Pages ne peut pas envoyer de messages. Si le salon le souhaite, un service comme Formspree (offre gratuite limitée, données traitées hors de Suisse) pourrait être ajouté.
- **Pas de réservation en ligne** : l'action principale reste l'appel téléphonique.
- **Pas de carte intégrée** : volontairement (performance et vie privée : une carte Google intégrée transmet des données à Google dès l'ouverture de la page). Les boutons « Itinéraire » la remplacent.
- **Jours fériés** non gérés par le statut « ouvert / fermé » (mention « les horaires peuvent varier les jours fériés »).
- **Note Google** figée (à mettre à jour manuellement).
- **Mentions légales** rédigées selon les fonctionnalités réelles du site ; elles ne constituent pas un avis juridique.

---

## 9. Licences

- Polices **Fraunces** et **DM Sans** : SIL Open Font License 1.1 (usage web libre).
- Icônes et logo provisoire : dessinés pour ce projet.
