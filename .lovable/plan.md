# Overzichtelijke drill-down per doel

Doel: vanuit een compact overzicht kunnen gebruikers in één klik doorklikken naar de details van een grammaticaal doel (lidwoord, znw, …) en daar de inhoud voor A1, A2 en B1 uitgebreid lezen.

## Gedrag

**Standaardweergave (overzicht):**
- Domeinen (Naamwoorden, Voornaamwoorden, …) zijn ingeklapt — alleen de domeinnaam zichtbaar.
- Klik op een domein → de doelen eronder verschijnen, één per rij, met enkel hun naam (geen fase-inhoud, geen A1/A2/B1-vulling). Dit houdt het overzicht rustig.
- De kolomkoppen "Grammaticaal doel / A1 / A2 / B1" blijven staan ter oriëntatie, maar de doelrijen tonen nog geen inhoud.

**Doorklikken op een doel:**
- Klik op een doelnaam → die ene doelrij klapt open en toont in drie nette kolommen (A1, A2, B1) de fases en bullets uitgebreid.
- Andere doelen in hetzelfde domein blijven ingeklapt (alleen naam zichtbaar), zodat de aandacht bij het gekozen doel ligt.
- Meerdere doelen tegelijk openklappen mag — elk doel werkt onafhankelijk.
- Nogmaals klikken op de doelnaam → klapt weer dicht.

**Bestaande zoom op kolom blijft werken:**
- Klikken op A1, A2 of B1 in de header zoomt nog steeds in op die ene CEFR-kolom. In zoom-modus toont een opengeklapt doel uiteraard alleen die kolom (zoals nu).

**Visuele indicatoren:**
- Chevron-icoon (▶ / ▼) vóór elke domeinnaam én vóór elke doelnaam, zodat duidelijk is dat ze klikbaar zijn.
- Lichte hover-achtergrond op klikbare rijen.
- Opengeklapte doelrij krijgt een subtiel andere achtergrond zodat hij opvalt tegenover de ingeklapte buren.

## Adminmodus
Hetzelfde gedrag in `/admin`. Het potlood-icoon om te bewerken verschijnt pas wanneer een doel opengeklapt is (anders is er toch geen inhoud zichtbaar om te bewerken).

## Technisch

- `src/components/GrammarTable.tsx`: state uitbreiden met `openGoals: string[]` naast bestaande `openItems` (domeinen).
- Domein-rij: bij ingeklapt domein worden geen doelen gerenderd (huidig gedrag al zo).
- Doel-rij splitsen in twee delen:
  - **Header-rij van het doel** (altijd zichtbaar wanneer domein open is): doelnaam + chevron, vier kolommen breed maar alleen de eerste kolom is gevuld; klikbaar om te togglen in `openGoals`.
  - **Inhoud-rij** (alleen zichtbaar als doel-id in `openGoals` zit): de huidige `PhaseList` per niveau (A1/A2/B1), of in zoom-modus alleen het actieve niveau.
- Bij klikken op een kolomheader (zoom) niet langer automatisch alle domeinen openklappen; gebruiker bepaalt zelf wat hij opent.
- Geen wijzigingen aan database, hooks of types nodig.
