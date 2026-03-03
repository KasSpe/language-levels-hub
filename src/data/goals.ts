import { Goal } from "./types";

export const goals: Goal[] = [
  // NAAMWOORDEN
  { id: "lidwoord",               domain: "naamwoorden",            name: "Lidwoord" },
  { id: "znw",                    domain: "naamwoorden",            name: "Zelfstandig naamwoord" },
  { id: "bn",                     domain: "naamwoorden",            name: "Bijvoeglijk naamwoord" },
  { id: "tw",                     domain: "naamwoorden",            name: "Telwoord" },

  // VOORNAAMWOORDEN
  { id: "persoonlijk-vnw",        domain: "voornaamwoorden",        name: "Persoonlijk voornaamwoord" },
  { id: "bezittelijk-vnw",        domain: "voornaamwoorden",        name: "Bezittelijk voornaamwoord" },
  { id: "aanwijzend-vnw",         domain: "voornaamwoorden",        name: "Aanwijzend voornaamwoord" },
  { id: "onbepaald-vnw",          domain: "voornaamwoorden",        name: "Onbepaald voornaamwoord" },
  { id: "vragend-vnw",            domain: "voornaamwoorden",        name: "Vragend voornaamwoord" },

  // TAALSTRUCTURERENDE WOORDEN
  { id: "voorzetsel",             domain: "taalstructuur",          name: "Voorzetsel" },
  { id: "voegwoord",              domain: "taalstructuur",          name: "Voegwoord" },

  // WERKWOORDEN
  { id: "ott",                    domain: "werkwoordstijden",       name: "Onvoltooid tegenwoordige tijd" },
  { id: "hebben-zijn-ott",        domain: "specifieke-vormen",      name: "Hebben en zijn (ott)" },
  { id: "onpersoonlijke-ww",      domain: "specifieke-vormen",      name: "Onpersoonlijke werkwoorden" },
  { id: "modale-ww",              domain: "complexe-constructies",  name: "Modale werkwoorden" },

  // ZINNEN
  { id: "enkelvoudige-zinnen",    domain: "zinsstructuren",         name: "Enkelvoudige zinnen" },
  { id: "zinsdelen-aanduiden",    domain: "zinsdelen",              name: "Zinsdelen aanduiden" },

  // Placeholder domein (in document leeg)
  { id: "woordsoorten-overig",    domain: "woordsoorten",           name: "Woordsoorten (overig)" },
];
