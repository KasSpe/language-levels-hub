

# Inhoud van de tabel beheren (alleen voor jou)

Je wil de inhoud van de grammaticatabel (fases, bullets, voorbeelden per doel × niveau) makkelijk kunnen wijzigen, zonder dat bezoekers van de site dit kunnen. Hieronder de aanbevolen aanpak en twee alternatieven.

## Aanbevolen aanpak: Lovable Cloud + admin-login

We slaan de inhoud op in een database (Lovable Cloud / Supabase) en bouwen een afgeschermd admin-paneel. Bezoekers zien de tabel alleen-lezen; jij logt in en kan alles bewerken via een formulier.

### Wat de gebruiker krijgt te zien

- **Publiek (`/`)**: de bestaande tabel, exact zoals nu, maar met inhoud die uit de database komt.
- **Admin (`/admin`)**: zelfde tabel-structuur, maar elke fase-cel is klikbaar → opent een bewerkformulier (titel, bullets, voorbeelden, gewicht). Opslaan = direct zichtbaar op de publieke pagina.
- **Login (`/auth`)**: e-mail + wachtwoord. Alleen jouw account heeft de `admin`-rol; anderen die per ongeluk de pagina bezoeken zien "geen toegang".

### Stappen

1. **Lovable Cloud activeren** (database + auth in één klik, geen extern account nodig).
2. **Database opzetten**:
   - `domains`, `goals` (zoals nu in `src/data/`, maar in tabellen).
   - `phase_content` (één rij per doel × niveau × fase, met titel, bullets als JSON-array, voorbeelden, gewicht).
   - `user_roles` (aparte tabel met enum `app_role`, volgens de veilige Lovable-conventie — rollen NOOIT op profiel-tabel).
3. **Seed-script**: huidige inhoud van `src/data/phases.ts` éénmalig naar de database migreren, zodat je niet opnieuw moet beginnen.
4. **Row-Level Security (RLS)**:
   - Iedereen mag `select` op `domains`, `goals`, `phase_content` (publieke leestabel).
   - Alleen `admin` mag `insert / update / delete` (via `has_role(auth.uid(), 'admin')` security-definer functie).
5. **Publieke pagina (`/`)**: huidige `Index.tsx` aanpassen om data via React Query uit de database te halen i.p.v. statische imports.
6. **Auth-pagina (`/auth`)**: e-mail/wachtwoord login + signup (signup kan je daarna uitschakelen of beperken).
7. **Admin-pagina (`/admin`)**:
   - Beschermd via een `<ProtectedRoute>` die controleert of de ingelogde gebruiker de `admin`-rol heeft.
   - Zelfde tabel-weergave, maar elke fase-cel opent een dialog met formulier (titel, bullets, voorbeelden, gewicht).
   - Opslaan via mutation → tabel ververst automatisch.
8. **Jouw admin-account aanmaken**: na eerste signup geef ik jou de `admin`-rol via de database.

### Voordelen

- Wijzigingen zijn direct live, zonder code te bewerken.
- Bezoekers kunnen niets wijzigen (RLS dwingt dit af op database-niveau, niet alleen in de UI).
- Schaalt mee als je later extra velden of niveaus wil toevoegen.
- Werkt vanaf elk toestel (laptop, tablet) zolang je inlogt.

### Technische details

- Tabellen: `domains(id, name, icon, sort_order)`, `goals(id, domain_id, name, sort_order)`, `phase_content(id, goal_id, level, phase, title, bullets jsonb, examples jsonb, weight, updated_at)`, `user_roles(id, user_id, role app_role)`.
- Enum `app_role`: `'admin' | 'user'`.
- Security-definer functie `has_role(_user_id uuid, _role app_role)` voor RLS-policies.
- Frontend: `@tanstack/react-query` voor data-fetching, bestaande shadcn `Dialog` + `Form` voor het bewerkformulier.
- Routes: `/` (publiek), `/auth` (login), `/admin` (beschermd, lijst + bewerken).

---

## Alternatief 1: Wachtwoord-veld in de UI (lichter, minder veilig)

Eén gedeelde admin-modus die je activeert met een wachtwoord in de URL of een knop. Geen database nodig, inhoud blijft in code-bestanden. **Nadeel**: niet echt veilig (wachtwoord staat in de frontend), en wijzigingen vergen nog steeds een code-deploy. Niet aanbevolen voor jouw use case.

## Alternatief 2: Inhoud blijven beheren in `src/data/phases.ts`

Niets wijzigen, gewoon het bestand zelf aanpassen wanneer nodig. **Nadeel**: vereist dat je telkens via Lovable de code wijzigt, en je hebt nu al een type-fout in dat bestand die eerst opgelost moet worden. Werkt, maar is omslachtig.

---

## Bonus: bestaande build-fout oplossen

Er staan momenteel 18 TypeScript-fouten in `src/data/phases.ts` omdat het type `PhaseContent` geen `fase1/fase2/fase3` velden kent. Het type `GoalPhaseMap` verwacht `[level][phase] = PhaseContent`, maar de data nest `PhaseContent` één laag te diep. Ik corrigeer in dezelfde sessie het type (of de data-structuur) zodat de site weer compileert.

---

## Wat ik je voorstel

Ga voor de **aanbevolen aanpak** (Lovable Cloud + admin-paneel). Dit is de enige optie die echt voldoet aan "ik kan makkelijk wijzigen, gebruikers niet". Zeg het woord en ik bouw het in deze volgorde: Cloud activeren → tabellen + RLS → seed huidige data → auth + admin-route → bewerkformulier → jouw admin-account toekennen.

