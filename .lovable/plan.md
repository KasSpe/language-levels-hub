# Overzicht visueel opvullen

Doel: de tabel voelt niet meer leeg aan — domeinrijen en doelcellen tonen meteen inhoud, zonder dat de gebruiker hoeft door te klikken. Visuele stijlopfrissing (kleuren/typografie) laten we voorlopig achterwege.

## Gedrag

**Domeinrijen (ingeklapt én open):**
- Naast de domeinnaam tonen we in de niveaukolommen voorbeelden van het type woord, bijvoorbeeld bij "Naamwoorden": *de, het · tafel, mooi · twee, eerste*.
- Voorbeelden staan als rustige grijze tekst (muted) verspreid over de kolommen, zodat de rij meteen "gevuld" oogt.

**Doelrijen (domein open, doel nog dicht):**
- In elke niveaucel (ALFA / A1 / A2 / B1) tonen we een compacte opsomming van wat er op dat niveau voor dat doel staat: de fasetitels als korte lijst (bijv. "Fase 1 – het/de bij woorden", "Fase 2 – …").
- Lege niveaus tonen een subtiel streepje (—) zoals nu in de faseweergave gebruikelijk is.
- De tekst is klein en gedempt (muted), zodat het overzicht rustig blijft maar wel informatief is.

**Doorklikken blijft ongewijzigd:**
- Klik op een doel klapt nog steeds de volledige fase-inhoud uit (zoals nu); de compacte lijst in de doelrij verdwijnt dan en maakt plaats voor de uitgebreide inhoudsrij.
- Zoom op niveaukolom (klik op ALFA/A1/A2/B1-header) blijft werken; in zoommodus toont de doelrij alleen de lijst van het actieve niveau.

## Technisch

- `src/components/GrammarTable.tsx`:
  - Domeinrij: in plaats van lege cellen (`&nbsp;`) een nieuwe statische map `domainExamples: Record<string, string[]>` (voorbeelden per domein, per kolom verspreid) renderen als `text-sm text-muted-foreground`.
  - Doelrij (niet-open): per niveaucel de fasetitels ophalen uit `phasesMap` (`${goalId}|${level}|faseX` → `title`) en als compacte `<ul>` tonen; leeg → "—".
  - Open doel: huidige uitgebreide inhoudsrij behouden.
- Voorbeelden per domein zijn statisch in de component (kleine vaste lijst); geen database- of typewijzigingen nodig.
- Geen wijzigingen aan admin, hooks, routes of styling-tokens.
