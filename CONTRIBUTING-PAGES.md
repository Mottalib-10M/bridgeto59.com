# Écrire ou étoffer une page de Bridge to 59 (us-fire)

Notice pour les agents qui écrivent les pages. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** : retraite anticipée aux États-Unis (FIRE) et accès à l'épargne retraite avant 59½ : FIRE number avec impôt
fédéral 2026 et assurance santé jusqu'à 65 ans, Coast / Barista / Lean / Fat FIRE, règle des 4 %, séquence des rendements,
rule of 55 (50 pour la sécurité publique), 72(t) / SEPP, pénalité de 10 % et exceptions, Roth conversion ladder,
retraits Roth, 457(b), pont santé avant Medicare (ACA), impôt d'État sur les retraits. **Anglais américain seul**, sous `/en/`.
Éditeur : la société **Radif Partners** (jamais un nom de personne). Nom provisoire du site : « Bridge to 59 ».

**L'angle (phrase de valeur ajoutée)** : les calculateurs FIRE concurrents s'arrêtent à « 25 × dépenses » et supposent
que tout l'argent est accessible ; nous disons à quel âge et dans quel ordre chaque compte s'ouvre avant 59½ et ajoutons
l'impôt 2026, la pénalité de 10 % et la santé jusqu'à Medicare, sans e-mail ni vente. Rapport SERP :
`~/Documents/GitHub/reports/us-fire-serp-2026-10-15.md`.

## Interdits

- **Social Security** : aucune page, au plus une phrase qui dit qu'on le laisse de côté. Ne jamais lier ni copier
  socialsecurityage.com, truetakehomepay.com ni aucun site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`).
- Aucun lien vers un courtier, un gestionnaire, un conseiller, un assureur (fidelity, schwab, vanguard, empower…), aucun
  conseil personnalisé (« you should »), aucune promesse de rendement. Liens externes : seulement des sources officielles
  (irs.gov, healthcare.gov, medicare.gov, dol.gov, ecfr.gov, sites .gov des États), par `h.src(clé)` ou `h.ext(url, texte)`
  pour une URL officielle **que tu as lue** (à signaler dans ton compte rendu).
- **Un chiffre incertain ne se publie pas.** Tout chiffre vient du kit (`K.…`) ou d'un calcul du moteur ; un nombre absent
  du kit ne s'écrit pas, sauf lu toi-même sur une source officielle (alors `h.ext`, et signale-le).

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Pénalité 10 %, âges, exceptions, retenue 20 % | IRS exceptions table, Pub. 575, Topic 558 | `src/data/params-2026.json` (`early`, `exceptions`) |
| Barèmes fédéraux 2026, déduction standard, seuils 0/15 % | Rev. Proc. 2025-32 | `tax` |
| Plafonds 2026 (401(k) 24 500, catch-up, IRA, HSA, 415(c)) | IR-2025-111, Notice 2025-67, Rev. Proc. 2025-19 | `limits` |
| 72(t) : taux plancher 5 %, 120 % mid-term AFR par mois (Rev. Rul. 2026-2 à 2026-19), exemple IRS | Notice 2022-6, FAQ SEPP, revenue rulings | `sepp` |
| Tables de mortalité / espérance de vie | 26 CFR 1.401(a)(9)-9 | `src/data/life-tables.json` |
| ACA : seuils de pauvreté 2025/2026, pourcentages 2026/2027, plafond 400 %, COBRA 18 mois / 102 % | HealthCare.gov, Rev. Proc. 2025-25, 2026-26, DOL | `aca` |
| États | sites des administrations fiscales des États, lus le 2026-10-15 | `src/data/states.json` (+ citations dans `research/states-facts.json`) |

Textes officiels extraits pour lire : `research/sources/*.txt` (table des exceptions IRS, FAQ SEPP, Notice 2022-6,
Pub. 575, Pub. 590-B chapitre Roth, Topic 558). Lis-les avant d'écrire une règle.

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| État | `src/content/states/<slug>.ts` (`defineState`, slug = clé de `states.json`) | `/en/state-tax/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Liste des pages prévues : `src/lib/planned.ts`. **Modèle (copier la structure, jamais les phrases)** :
`src/content/guides/rule-of-55.ts`.

Le gabarit affiche seul : H1, `intro`, le calculateur (`tool`, réglé par `toolArg`), le chapeau replié (`resume`), le
corps (`body`), la FAQ, les pages liées, les sources. Sur un État : H1 fixé par le gabarit, le calculateur `state`
réglé sur l'État, les sources de l'État (`states.json`).

### Champs

| Champ | Règle |
|---|---|
| `title` | **50 à 60 caractères** au caractère près, contient **2026**, **terme-clé en tête** (« Coast FIRE Calculator 2026: … », « 72(t) Calculator 2026: … »). Jamais How/What/When/Is/Can, ni « US », « American », « Calculator » en tête ; pas de tiret cadratin ni demi-cadratin ; unique |
| `description` | **150 à 160 caractères**, contient 2026, un chiffre du kit, unique |
| `intro` | une phrase propre à la page (sous le H1) |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à la requête, chiffres compris ; la première phrase porte le message |
| `body(h)` | HTML (`h2`, `h3`, `p`, `ul`, `h.table`). Guides : ≥ 650 mots de prose hors tableaux (viser 750 à 1 000). États : ≥ 300 (viser 350 à 500) |
| `faqs` | 3 à 6 vraies questions, réponses **40 à 90 mots**, chiffre + condition ; **une question n'existe qu'une fois sur tout le site** : mets le terme propre à la page dans la question |
| `related` | 3 à 6 ids (`rule-of-55`, `state:california`…) |
| `sources` (guides) | ≥ 2 clés de `params-2026.json > sources` |
| `tool` (guides) | une clé de `src/lib/tool-specs.ts` (`firenum`, `need`, `coast`, `barista`, `tiers`, `swr`, `sequence`, `when`, `rate`, `byAge`, `lasts`, `rule55`, `sepp`, `seppRate`, `recapture`, `penalty`, `net`, `exceptions`, `draw`, `withholding`, `ladder`, `roth`, `gov457`, `bridgeYears`, `aca`, `cliff`, `cobra`, `tax`, `ltcg`, `state`, `limits`) ou `fire` (calculateur complet) |
| `toolArg` | valeurs par défaut du calculateur pour cette page (mêmes clés que les champs de la spec), ex. `{ acc: 'ira' }`, `{ ps: 'yes' }`, `{ ret: 55 }` pour `fire` |

## Le kit (règle des chiffres)

```ts
import { KIT as K } from '../../lib/kit';
K.P                  // params-2026.json : K.P.early.penalty, K.P.tax.standardDeduction.single, K.P.limits.deferral, K.P.sepp.afr['2026-10'].mid120, K.P.aca.fpl['2026'].one…
K.S('california')    // un État de states.json (name, rate, earlyPenalty, exclusions, summary, rules, sources)
K.tool('penalty', { amt: 30000, age: 50 })   // lance un calculateur, renvoie { label, value, sub, rows }
K.early({ amount, age, account: 'plan'|'oldPlan'|'ira'|'gov457'|'rothBasis'|'rothEarnings', exception, status, otherIncome, stateRate })
K.tax({ ordinary, ltcg, status }), K.extraTax(base, extra, status), K.rule55({ birthYear, separationYear, publicSafety, serviceYears })
K.sepp(method, balance, age, rate, table), K.maxRate('2026-11'), K.lockEnd('2026-11-01', '1976-06-01'), K.life(age), K.CAP_MONTHS
K.roth({...}), K.ladder({...}), K.ptc({ year: '2026', size, magi, benchmarkMonthly }), K.fpl('2026', size)
K.fireNumber(spend, swr), K.yearsTo(target, bal, contrib, r), K.coast(target, age, retireAge, r), K.coastAge(...), K.barista(...), K.lasts(p, w, r), K.crash(...), K.yearsFromRate(...)
K.quick({ spend, swr, status, pretaxShare, taxableShare, health, healthYears }), K.plan(PlanIn), K.bridge(PlanIn, age), K.stateTax(slug, amount, age, rate, fedPenalty)
K.usd(x) → "$1,234" ; K.pct(0.054, 2) → "5.40 %" ; K.num(x) ; K.dec(x, 1) ; K.day('2026-10-15') ; K.month('2026-11') → "November 2026"
```

Dans `body(h)` : tout le kit, plus `h.a(id, texte)` (lien interne ; id inconnu = test en échec, sauf id prévu dans
`planned.ts`), `h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte)`, `h.ext(url, texte)`,
`h.box(titre, html)`, `h.mini(kind, { t: 'titre', p: ['ids des champs montrés'], d: { valeurs par défaut } })`.

**Mini-simulateurs (RECETTE §9.3)** : 1 à 3 par page, **au moins un**, chacun sur le sujet du paragraphe qui le précède,
construit sur une spec de `tool-specs.ts` (1 ou 2 champs montrés, valeurs par défaut propres à la page). Ne pas
reprendre le même mini avec les mêmes valeurs qu'une autre page.

## Ton et unicité

- Anglais américain, voix humaine, phrases de longueur variable, **le chiffre d'abord**. Lecteur : 30 à 55 ans, qui épargne
  et veut partir tôt ; expliquer chaque sigle (MAGI, SEPP, AFR, QDRO) à sa première apparition.
- Interdits (le test les refuse) : tirets cadratin et demi-cadratin, « it's important to note », « dive into », « delve »,
  « whether you're », « navigate the », « Moreover », « Additionally », « Furthermore », « game changer », « unlock »,
  « guaranteed ». Pas de triplets en série, pas de conclusion qui résume, pas d'émoji.
- **Unicité** (§6) : `check-unique` compare toutes les pages (texte hors tableaux et hors calculateur, chiffres neutralisés,
  seuil 30 %). Titres `h2`/`h3` propres à la page, angle propre, exemples chiffrés propres (âges, montants différents
  d'une page à l'autre). Ne jamais reprendre une phrase d'une autre page, même chiffres changés.
- **Pas de copie entre sites** : aucun paragraphe repris d'un autre site du portefeuille (`check-portefeuille`).
- Écris `10 %` (espace insécable géré au build) ou utilise `K.pct`.

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-fire
PAGE_FILES=rule-of-55,state:california npx vitest run tests/pages.test.ts   # tes pages
python3 scripts/sim-pages.py --only rule-of-55,state:california             # similarité (après le test ci-dessus)
npx vitest run tests/engine.test.ts                                           # moteur
```

Serveur local : port **4385** (`npm run preview`), arrêt par le port (`lsof -ti tcp:4385 | xargs kill`), jamais `pkill -f`.

## Mise à jour annuelle

1. Octobre-novembre : Rev. Proc. des barèmes de l'année suivante, Notice des plafonds → `params-<année>.json`.
2. Chaque mois : la revenue ruling AFR du mois → `sepp.afr` (le test des mois plafonnés suit).
3. Juillet-août : Rev. Proc. des pourcentages ACA ; janvier : seuils de pauvreté HHS sur HealthCare.gov.
4. États : relire chaque règle de `states.json` sur le site de l'État (barèmes 2026 de CA, NY, NJ, CO à compléter).
5. `npx vitest run`, puis tous les contrôles.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS.
- Ne pas toucher à `_trame` ni à la RECETTE.
- `CLARITY_ID` vide, aucune publicité tant que l'éditeur n'a pas décidé ; jamais de publicité de courtier ou de conseiller.
