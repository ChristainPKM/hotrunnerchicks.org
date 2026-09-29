"use strict";

// Hier werden Saison, Spieler und Ligaabende gepflegt; pokemon.js verarbeitet die Daten.
// Die Mindestzahl ist ein Planungsziel, keine Grenze für Veranstaltungen.
const saison = {
  name: "Saison 2026/27",
  mindestTurniere: 12
};

// Diese IDs gelten nur auf unserer Website, nicht als offizielle Pokémon Player IDs.
const spielerListe = [
  { id: "P001", name: "Anna" },
  { id: "P002", name: "Max" },
  { id: "P003", name: "Christian" },
  { id: "P004", name: "Lisa" },
  { id: "P005", name: "Peter" },
  { id: "P006", name: "Julia" },
  { id: "P007", name: "Thomas" }
];

// Die Spieler-IDs stehen in der Reihenfolge ihrer Platzierung.
const veranstaltungen = [
  {
    datum: "22.09.2026",
    platzierungen: ["P001", "P002", "P003", "P004"],
    weitereTeilnehmer: ["P005", "P006"]
  },
  {
    datum: "29.09.2026",
    platzierungen: ["P002", "P003", "P006", "P001"],
    weitereTeilnehmer: ["P004", "P005"]
  },
  {
    datum: "06.10.2026",
    platzierungen: ["P003", "P006", "P002", "P005"],
    weitereTeilnehmer: ["P001", "P004"]
  }
];
