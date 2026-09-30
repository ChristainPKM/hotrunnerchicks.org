"use strict";

// Diese Datei verarbeitet die Ligadaten aus liga-daten.js und zeigt die Ergebnisse an.

const teilnahmePunkte = 1;
const platzierungsPunkte = [5, 3, 2, 1];

// Alte Turniere werden nur zum Lesen in dieselbe Form wie neue Wertungen gebracht.
function turnierWertungen(turnier) {
  if (Array.isArray(turnier.wertungen)) return turnier.wertungen;
  return [{ bezeichnung: "", ergebnisse: [
    ...turnier.platzierungen.map((spielerId, index) => ({ spielerId, platz: index + 1 })),
    ...turnier.weitereTeilnehmer.map(spielerId => ({ spielerId, platz: null }))
  ] }];
}
function berechneLigatabelle(ligaabende) {
  // Die ID ist der Schlüssel; der Anzeigename kommt aus der zentralen Liste.
  const spielerNachId = new Map(spielerListe.map(spieler => [spieler.id, spieler]));
  const spieler = new Map();

  for (const abend of ligaabende) {
    // Ein Set enthält jede ID nur einmal, auch bei mehrfacher Nennung.
    const ergebnisse = turnierWertungen(abend).flatMap(wertung => wertung.ergebnisse);
    const teilnehmer = new Set(ergebnisse.map(ergebnis => ergebnis.spielerId));

    for (const id of teilnehmer) {
      if (!spielerNachId.has(id)) {
        console.warn(`Unbekannte Spieler-ID "${id}" in der Veranstaltung vom ${abend.datum}: Eintrag wird übersprungen.`);
        continue;
      }

      if (!spieler.has(id)) {
        spieler.set(id, {
          id: id,
          name: spielerNachId.get(id).name,
          kategorie: spielerNachId.get(id).kategorie,
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
    ergebnisse.forEach(({ spielerId: id, platz }) => {
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
      if (Number.isInteger(platz) && platz >= 1 && platz <= 4) {
        eintrag.plaetze[platz - 1] += 1;
        eintrag.punkte += platzierungsPunkte[platz - 1];
      }
    });
  }

  // Namen ordnen nur gleichplatzierte Spieler, nicht deren Tabellenplatz.
  return [...spieler.values()].sort((a, b) =>
    vergleicheSpieler(a, b) || a.name.localeCompare(b.name, "de")
  );
}

function vergleicheSpieler(a, b) {
  // Bei Gleichstand (Differenz 0) prüft || das nächste Kriterium.
  // b minus a sortiert Zahlen absteigend: größere Werte stehen vorne.
  return b.punkte - a.punkte
    || b.teilnahmen - a.teilnahmen
    || b.plaetze[0] - a.plaetze[0]
    || b.plaetze[1] - a.plaetze[1]
    || b.plaetze[2] - a.plaetze[2]
    || b.plaetze[3] - a.plaetze[3];
}

function zeigeLigatabelle(ligatabelle) {
  // Die Punkte bleiben gleich; jede Altersgruppe erhält ihre eigene Rangfolge.
  zeigeRangliste(ligatabelle.filter(s => s.kategorie === "Junior" || s.kategorie === "Senior"), "#liga-junior-senior");
  zeigeRangliste(ligatabelle.filter(s => s.kategorie === "Master"), "#liga-master");
}

function zeigeRangliste(ligatabelle, ziel) {
  const tabellenInhalt = document.querySelector(ziel);
  tabellenInhalt.replaceChildren();

  // Jede Rangliste zeigt unabhängig ihren leeren Zustand.
  if (ligatabelle.length === 0) {
    const zeile = document.createElement("tr");
    const zelle = document.createElement("td");
    zelle.colSpan = 9;
    zelle.className = "empty-state";
    zelle.textContent = "Noch keine Teilnehmer für diese Saison eingetragen.";
    zeile.appendChild(zelle);
    tabellenInhalt.appendChild(zeile);
    return;
  }

  let platz = 1;

  ligatabelle.forEach((spieler, index) => {
    // Bei gleichen Wertungsdaten bleibt der Platz gleich (z. B. 1, 2, 2, 4).
    if (index > 0 && vergleicheSpieler(ligatabelle[index - 1], spieler) !== 0) {
      platz = index + 1;
    }
    const zeile = document.createElement("tr");
    const werte = [
      platz,
      spieler.name,
      spieler.kategorie,
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

function zeigeTurnierergebnisse(ligaabende) {
  const bereich = document.querySelector("#turnierergebnisse");
  const namenNachId = new Map(spielerListe.map(spieler => [spieler.id, spieler.name]));
  bereich.replaceChildren();
  // Beim erneuten Aufbau auch die bisherige zentrale Schaltfläche entfernen.
  document.querySelector("#weitere-turniere")?.remove();
  const aeltereBloecke = [];

  if (ligaabende.length === 0) {
    const hinweis = document.createElement("p");
    hinweis.textContent = "Noch keine Ligaturniere gewertet.";
    bereich.appendChild(hinweis);
    return;
  }

  // TT.MM.JJJJ in eine sortierbare Zahl umwandeln; Originaldaten nicht umsortieren.
  const datumswert = datum => {
    const [tag, monat, jahr] = datum.split(".");
    return Number(`${jahr}${monat.padStart(2, "0")}${tag.padStart(2, "0")}`);
  };
  const sortierteAbende = [...ligaabende].sort((a, b) => datumswert(b.datum) - datumswert(a.datum));

  for (const [turnierIndex, abend] of sortierteAbende.entries()) {
    const block = document.createElement("article");
    block.className = "tournament-result";
    block.id = `turnierergebnis-${turnierIndex}`;
    if (turnierIndex >= 2) {
      block.hidden = true;
      aeltereBloecke.push(block);
    }
    const titel = document.createElement("h3");
    titel.textContent = abend.datum;
    block.appendChild(titel);

    // Wie in der Ligawertung: unbekannte IDs und doppelte Nennungen überspringen.
    const angezeigt = new Set();
    for (const [wertungsIndex, wertung] of turnierWertungen(abend).entries()) {
      const abschnitt = document.createElement("section");
      if (wertung.bezeichnung) {
        const titel = document.createElement("h4");
        titel.textContent = wertung.bezeichnung;
        abschnitt.appendChild(titel);
      }
      const liste = document.createElement("ul");
      const weitereNamen = [];
      for (const { spielerId, platz } of wertung.ergebnisse) {
        if (!namenNachId.has(spielerId) || angezeigt.has(spielerId)) continue;
        angezeigt.add(spielerId);
        if (platz !== null && platz <= 4) {
          const li = document.createElement("li");
          li.textContent = `${platz}. Platz – ${namenNachId.get(spielerId)}`;
          liste.appendChild(li);
        } else weitereNamen.push(namenNachId.get(spielerId));
      }
      abschnitt.appendChild(liste);
      if (weitereNamen.length) {
        const weitere = document.createElement("p");
        weitere.id = `turnier-teilnehmer-${turnierIndex}-${wertungsIndex}`;
        weitere.textContent = `Weitere Teilnehmer: ${weitereNamen.join(", ")}`;
        weitere.hidden = true;
        const schalter = document.createElement("button");
        schalter.type = "button"; schalter.className = "participants-toggle";
        schalter.textContent = "Weitere Teilnehmer anzeigen";
        schalter.setAttribute("aria-expanded", "false");
        schalter.setAttribute("aria-controls", weitere.id);
        schalter.addEventListener("click", () => {
          weitere.hidden = !weitere.hidden;
          schalter.textContent = weitere.hidden ? "Weitere Teilnehmer anzeigen" : "Weitere Teilnehmer ausblenden";
          schalter.setAttribute("aria-expanded", String(!weitere.hidden));
        });
        abschnitt.append(schalter, weitere);
      }
      block.appendChild(abschnitt);
    }
    bereich.appendChild(block);
  }

  // Nur anbieten, wenn es mehr als zwei Turniere gibt.
  if (aeltereBloecke.length > 0) {
    const schalter = document.createElement("button");
    schalter.id = "weitere-turniere";
    schalter.type = "button";
    schalter.className = "tournaments-toggle";
    schalter.textContent = "Weitere Turnierergebnisse anzeigen";
    schalter.setAttribute("aria-expanded", "false");
    schalter.setAttribute("aria-controls", aeltereBloecke.map(block => block.id).join(" "));
    schalter.addEventListener("click", () => {
      const aufklappen = schalter.getAttribute("aria-expanded") === "false";
      for (const block of aeltereBloecke) {
        block.hidden = !aufklappen;
        // Ältere Karten beginnen beim erneuten Öffnen wieder kompakt.
        if (!aufklappen) {
          for (const teilnehmerSchalter of block.querySelectorAll(".participants-toggle")) {
            document.getElementById(teilnehmerSchalter.getAttribute("aria-controls")).hidden = true;
            teilnehmerSchalter.textContent = "Weitere Teilnehmer anzeigen";
            teilnehmerSchalter.setAttribute("aria-expanded", "false");
          }
        }
      }
      schalter.setAttribute("aria-expanded", String(aufklappen));
      schalter.textContent = aufklappen ? "Weniger Turnierergebnisse anzeigen" : "Weitere Turnierergebnisse anzeigen";
    });
    bereich.after(schalter);
  }
}

// Alle eingetragenen Veranstaltungen gelten bereits als gewertete Ligaturniere.
zeigeTurnierergebnisse(veranstaltungen);

