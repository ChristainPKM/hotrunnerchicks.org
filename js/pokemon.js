"use strict";

// Diese Datei verarbeitet die Ligadaten aus liga-daten.js und zeigt die Ergebnisse an.

const teilnahmePunkte = 1;
const platzierungsPunkte = [5, 3, 2, 1];

function berechneLigatabelle(ligaabende) {
  // Die ID ist der Schlüssel; der Anzeigename kommt aus der zentralen Liste.
  const spielerNachId = new Map(spielerListe.map(spieler => [spieler.id, spieler]));
  const spieler = new Map();

  for (const abend of ligaabende) {
    // Ein Set enthält jede ID nur einmal, auch bei mehrfacher Nennung.
    const teilnehmer = new Set([...abend.platzierungen, ...abend.weitereTeilnehmer]);

    for (const id of teilnehmer) {
      if (!spielerNachId.has(id)) {
        console.warn(`Unbekannte Spieler-ID "${id}" in der Veranstaltung vom ${abend.datum}: Eintrag wird übersprungen.`);
        continue;
      }

      if (!spieler.has(id)) {
        spieler.set(id, {
          id: id,
          name: spielerNachId.get(id).name,
          teilnahmen: 0,
          plaetze: [0, 0, 0, 0],
          punkte: 0
        });
      }

      const eintrag = spieler.get(id);
      eintrag.teilnahmen += 1;
      eintrag.punkte += teilnahmePunkte;
    }

    // Array-Indizes beginnen bei 0: Index 0 entspricht dem ersten Platz.
    const gewertetePlatzierungen = new Set();
    abend.platzierungen.forEach((id, index) => {
      // Ungültige IDs überspringen, ohne die Plätze der anderen zu verschieben.
      if (!spielerNachId.has(id)) {
        return;
      }
      // Bei doppelter Platzierung zählt nur das erste Vorkommen dieser ID.
      if (gewertetePlatzierungen.has(id)) {
        return;
      }
      gewertetePlatzierungen.add(id);

      const eintrag = spieler.get(id);
      eintrag.plaetze[index] += 1;
      eintrag.punkte += platzierungsPunkte[index];
    });
  }

  return [...spieler.values()].sort(vergleicheSpieler);
}

function vergleicheSpieler(a, b) {
  // Bei Gleichstand (Differenz 0) prüft || das nächste Kriterium.
  // b minus a sortiert Zahlen absteigend: größere Werte stehen vorne.
  return b.punkte - a.punkte
    || b.teilnahmen - a.teilnahmen
    || b.plaetze[0] - a.plaetze[0]
    || b.plaetze[1] - a.plaetze[1]
    || b.plaetze[2] - a.plaetze[2]
    || b.plaetze[3] - a.plaetze[3]
    || a.name.localeCompare(b.name, "de");
}

function zeigeLigatabelle(ligatabelle) {
  const tabellenInhalt = document.querySelector(".pokemon-page tbody");

  // Der vorhandene Hinweis bleibt sichtbar, wenn es keine Spieler gibt.
  if (ligatabelle.length === 0) {
    return;
  }

  tabellenInhalt.replaceChildren();

  ligatabelle.forEach((spieler, index) => {
    const zeile = document.createElement("tr");
    const werte = [
      index + 1,
      spieler.name,
      spieler.teilnahmen,
      ...spieler.plaetze,
      spieler.punkte
    ];

    // Die Werte folgen genau der Reihenfolge der bestehenden Spalten.
    for (const wert of werte) {
      const zelle = document.createElement("td");
      zelle.textContent = wert;
      zeile.appendChild(zelle);
    }

    tabellenInhalt.appendChild(zeile);
  });
}

// Gezählt werden alle eingetragenen Veranstaltungen, auch über das Ziel hinaus.
document.querySelector("#saison-name").textContent = saison.name;
document.querySelector("#saison-fortschritt").textContent =
  `${veranstaltungen.length} von mindestens ${saison.mindestTurniere} geplanten Turnieren gespielt`;

const ligatabelle = berechneLigatabelle(veranstaltungen);
zeigeLigatabelle(ligatabelle);
