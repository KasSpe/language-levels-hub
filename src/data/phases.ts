import { GoalPhaseMap } from "./types";

export const phaseContent: GoalPhaseMap = {
  // -------------------------
  // NAAMWOORDEN
  // -------------------------
  lidwoord: {
    A1: {
      fase1: {
        title: "Basis",
        weight: 1,
        bullets: [
          "Het lidwoord staat voor het zelfstandig naamwoord.",
          "Lidwoorden zijn bepaald of onbepaald.",
          "Bepaald lidwoord: iets/iemand is bekend.",
          "Onbepaald lidwoord: iets/iemand is onbekend."
        ]
      },
      fase2: {
        title: "Gebruik de / het / een",
        weight: 2,
        bullets: [
          "de → mannelijke en vrouwelijke zelfstandige naamwoorden (enk.).",
          "de → alle zelfstandige naamwoorden (mv.).",
          "het → onzijdige zelfstandige naamwoorden (enk.).",
          "het → verkleinwoorden.",
          "Tussen lidwoord en zelfstandig naamwoord kan een bijvoeglijk naamwoord staan.",
          "een → als de persoon/dier/zaak nog niet bekend is (enk.)."
        ]
      },
      fase3: { title: "—", weight: 3, bullets: [] }
    }
  },

  znw: {
    A1: {
      fase1: {
        title: "Wat is een zelfstandig naamwoord?",
        bullets: [
          "Namen voor mensen, dieren en zaken."
        ]
      },
      fase2: {
        title: "Meervoud",
        bullets: [
          "Meervoud op -en.",
          "Meervoud op -s.",
          "Meervoud op ’s."
        ]
      },
      fase3: {
        title: "Verkleinwoorden",
        bullets: [
          "Verkleinwoord op -je, -tje, -etje, -kje of -pje."
        ]
      }
    }
  },

  bn: {
    A1: {
      fase1: {
        title: "Wat is een bijvoeglijk naamwoord?",
        bullets: [
          "Geeft informatie over het zelfstandig naamwoord."
        ]
      },
      fase2: {
        title: "Plaats",
        bullets: [
          "Staat vóór het zelfstandig naamwoord.",
          "Staat na een vorm van ‘zijn’."
        ]
      },
      fase3: {
        title: "Trappen van vergelijking",
        bullets: [
          "Stellende, vergrotende, overtreffende trap.",
          "Onregelmatige vormen: goed, graag, veel, weinig."
        ]
      }
    }
  },

  tw: {
    A1: {
      fase1: {
        title: "Hoofdtelwoorden (0–20)",
        bullets: [
          "Hoofdtelwoord geeft hoeveelheid aan.",
          "Bereik: 0 tot 20."
        ]
      },
      fase2: {
        title: "Uitbreiding 0–50",
        bullets: [
          "Hoofdtelwoorden 0–50.",
          "Tientallen en honderdtallen.",
          "Vorm en gebruik."
        ]
      },
      fase3: {
        title: "Tijdsaanduidingen",
        bullets: [
          "Gebruik bij tijd: kwart over, kwart voor, half."
        ]
      }
    }
  },

  // -------------------------
  // VOORNAAMWOORDEN
  // -------------------------
  "persoonlijk-vnw": {
    A1: {
      fase1: {
        title: "Als onderwerp",
        bullets: [
          "Persoonlijk vnw verwijst naar personen, dieren of zaken.",
          "Staat zelfstandig.",
          "Vormen met nadruk: ze/zij, je/jij."
        ]
      },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Als voorwerp",
        bullets: [
          "Andere vormen als voorwerp.",
          "Vaak gebruikt na een voorzetsel."
        ]
      }
    }
  },

  "bezittelijk-vnw": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: {
        title: "Bijvoeglijk gebruikt",
        bullets: [
          "Staat bij een zelfstandig naamwoord.",
          "Drukt bezit uit."
        ]
      },
      fase3: {
        title: "Vormvariatie",
        bullets: [
          "Bijvoeglijk + mogelijk bijvoeglijk naamwoord tussenin.",
          "ons / onze."
        ]
      }
    }
  },

  "aanwijzend-vnw": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: {
        title: "Bijvoeglijk gebruikt",
        bullets: []
      },
      fase3: {
        title: "Zelfstandig gebruikt",
        bullets: []
      }
    }
  },

  "onbepaald-vnw": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Vormen",
        bullets: [
          "Onbepaald bijvoeglijk vnw: ieder(e), elk(e).",
          "Onbepaald zelfstandig vnw: ieder, elk, alle, wat, wie, allemaal."
        ]
      }
    }
  },

  "vragend-vnw": {
    A1: {
      fase1: {
        title: "Zelfstandig gebruikt",
        bullets: [
          "wie, wat"
        ]
      },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Bijvoeglijk gebruikt",
        bullets: [
          "welk(e)"
        ]
      }
    }
  },

  // -------------------------
  // TAALSTRUCTURERENDE WOORDEN
  // -------------------------
  voorzetsel: {
    A1: {
      fase1: {
        title: "Plaats",
        bullets: ["Voorzetsels van plaats"]
      },
      fase2: {
        title: "Richting",
        bullets: ["Voorzetsels van richting"]
      },
      fase3: {
        title: "Tijd & andere",
        bullets: [
          "Voorzetsels van tijd",
          "Andere voorzetsels (reden, oorzaak, doel)"
        ]
      }
    }
  },

  voegwoord: {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: {
        title: "Nevenschikking",
        bullets: [
          "en, of, maar, want"
        ]
      },
      fase3: { title: "—", bullets: [] }
    }
  },

  // -------------------------
  // WERKWOORDEN
  // -------------------------
  ott: {
    A1: {
      fase1: {
        title: "Vorm",
        bullets: ["OTT-vorm"]
      },
      fase2: {
        title: "Vorm + spelling",
        bullets: ["OTT-vorm + spelling"]
      },
      fase3: {
        title: "Vorm + spelling (versterken)",
        bullets: ["OTT-vorm + spelling"]
      }
    }
  },

  "hebben-zijn-ott": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: {
        title: "Vervoeging + gebruik",
        bullets: [
          "hebben (ott): vervoeging en gebruik",
          "zijn (ott): vervoeging en gebruik"
        ]
      },
      fase3: {
        title: "Vervoeging + gebruik (verdiepen)",
        bullets: [
          "hebben (ott): vervoeging en gebruik",
          "zijn (ott): vervoeging en gebruik"
        ]
      }
    }
  },

  "onpersoonlijke-ww": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Gebruik",
        bullets: [
          "Werkwoorden met het weer.",
          "Constructies met ‘het’: blijven, worden, zijn."
        ]
      }
    }
  },

  "modale-ww": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Vormen",
        bullets: ["kunnen, moeten, mogen, willen, zullen"]
      }
    }
  },

  // -------------------------
  // ZINNEN
  // -------------------------
  "enkelvoudige-zinnen": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: {
        title: "Volgorde",
        bullets: [
          "Onderwerp 1e plaats",
          "Persoonsvorm 2e plaats"
        ]
      },
      fase3: {
        title: "Volgorde (versterken)",
        bullets: [
          "Onderwerp 1e plaats",
          "Persoonsvorm 2e plaats"
        ]
      }
    }
  },

  "zinsdelen-aanduiden": {
    A1: {
      fase1: {
        title: "Basisonderdelen",
        bullets: [
          "Onderwerp",
          "Persoonsvorm",
          "Andere zinsdelen"
        ]
      },
      fase2: { title: "—", bullets: [] },
      fase3: {
        title: "Didactische ondersteuning",
        bullets: [
          "1‑2‑3: O / PV / E",
          "Kleurcodes: rood / geel / blauw",
          "Pictogrammen"
        ]
      }
    }
  },

  // (Woordsoorten-overig blijft voor A1 leeg in het document)
  "woordsoorten-overig": {
    A1: {
      fase1: { title: "—", bullets: [] },
      fase2: { title: "—", bullets: [] },
      fase3: { title: "—", bullets: [] }
    }
  }
};
