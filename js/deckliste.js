"use strict";

// Kalenderdaten in Berlin vergleichen: dadurch gelten Sommer- und Winterzeit automatisch.
function berlinerDatum(zeit = new Date()) {
  const teile = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(zeit);
  const wert = typ => teile.find(t => t.type === typ).value;
  return `${wert("year")}-${wert("month")}-${wert("day")}`;
}
function gueltigesDatum(datum) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return false;
  const d = new Date(`${datum}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === datum;
}
function deutschesDatum(datum) {
  return datum.split("-").reverse().join(".");
}
function abgabeschluss(datum) {
  const tag = new Date(`${datum}T12:00:00Z`);
  tag.setUTCDate(tag.getUTCDate() - 1);
  return `${deutschesDatum(tag.toISOString().slice(0, 10))} um 23:59 Uhr (deutsche Zeit)`;
}
function abgabeOffen(config, jetzt = new Date()) {
  return config.aktiv === true && gueltigesDatum(config.datum)
    && Boolean(config.name.trim()) && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(config.empfaenger)
    && berlinerDatum(jetzt) < config.datum;
}

// Überschriften zählen nicht mit. Jede sonstige Zeile muss eine Kartenzeile sein.
function pruefeDeckliste(text) {
  let anzahl = 0;
  const fehler = [];
  text.split(/\r?\n/).forEach((roh, index) => {
    const zeile = roh.trim();
    if (!zeile || /^(?:Pok[eé]mon|Trainer|Energ(?:y|ie))\s*:\s*\d+$/iu.test(zeile)
      || /^(?:Total Cards|Karten insgesamt|Karten gesamt|Gesamtanzahl Karten|Gesamtkarten)\s*:\s*\d+$/iu.test(zeile)) return;
    // Setcodes dürfen mit Zahlen beginnen; Kartennummern auch Buchstaben enthalten.
    const karte = /^(\d+)\s+(.+?)\s+([A-Z0-9]+(?:-[A-Z0-9]+)*)\s+([A-Za-z0-9]+(?:\/[A-Za-z0-9]+)?)$/u.exec(zeile);
    if (!karte || !/[\p{L}]/u.test(karte[2]) || Number(karte[1]) < 1 || Number(karte[1]) > 60) {
      fehler.push(`Zeile ${index + 1}: nicht erkannt oder ungültig – ${zeile}`);
    } else anzahl += Number(karte[1]);
  });
  return {anzahl, fehler, gueltig: anzahl === 60 && fehler.length === 0};
}
function erstelleNachricht(config, name, geburtsjahr, spielerId, kategorie, deck) {
  return `Turnier: ${config.name}\nTurnierdatum: ${deutschesDatum(config.datum)}\nSpieler: ${name}\nGeburtsjahr: ${geburtsjahr}\nPlay! Pokémon-Spieler-ID: ${spielerId}\nAltersklasse: ${kategorie}\n\nDeckliste:\n${deck}`;
}
function erstelleBetreff(config, name) {
  return `Deckliste – ${deutschesDatum(config.datum)} – ${config.name} – ${name}`;
}
function erstelleMailLink(config, name, nachricht) {
  return `mailto:${encodeURIComponent(config.empfaenger)}?subject=${encodeURIComponent(erstelleBetreff(config, name))}&body=${encodeURIComponent(nachricht)}`;
}

const formular = document.querySelector("#deck-form");
const deckText = document.querySelector("#deck-text");
const aktionsStatus = document.querySelector("#deck-aktion");
function aktualisiereStatus() {
  const c = decklistenTurnier;
  document.querySelector("#deck-turnier").textContent = c.name || "Decklistenabgabe";
  const datumOk = gueltigesDatum(c.datum);
  document.querySelector("#deck-termin").textContent = datumOk
    ? `Turnierdatum: ${deutschesDatum(c.datum)} · Abgabeschluss: ${abgabeschluss(c.datum)}` : "";
  const offen = abgabeOffen(c);
  formular.hidden = !offen;
  document.querySelector("#deck-status").textContent = offen ? "Die Decklistenabgabe ist geöffnet."
    : !c.aktiv ? "Aktuell ist keine Decklistenabgabe aktiviert."
    : datumOk && berlinerDatum() >= c.datum ? `Vielen Dank für euer Interesse an ${c.name}! Die Abgabe ist geschlossen. Abgabeschluss war ${abgabeschluss(c.datum)}.`
    : "Die Turnierkonfiguration ist noch nicht vollständig. Bitte später erneut vorbeischauen.";
  return offen;
}
function zeigePruefung() {
  const ergebnis = pruefeDeckliste(deckText.value);
  document.querySelector("#deck-anzahl").textContent = `${ergebnis.anzahl} von 60 Karten${ergebnis.gueltig ? " – Mengenprüfung bestanden" : " – bitte prüfen"}`;
  const liste = document.querySelector("#deck-fehler");
  liste.replaceChildren();
  for (const text of ergebnis.fehler) {
    const li = document.createElement("li"); li.textContent = text; liste.appendChild(li);
  }
  deckText.setCustomValidity(ergebnis.gueltig ? "" : "Bitte genau 60 Karten eintragen und alle markierten Zeilen korrigieren.");
  return ergebnis;
}
// Plausibilitätsprüfung ohne vollständiges Geburtsdatum; IDs bleiben Strings.
function pruefePersoenlichesFeld(feld) {
  const jahr = Number(berlinerDatum().slice(0, 4));
  let fehler = "";
  if (feld.id === "deck-geburtsjahr") {
    if (!/^[0-9]{4}$/.test(feld.value) || Number(feld.value) < jahr - 120 || Number(feld.value) > jahr) {
      fehler = `Bitte ein vierstelliges Geburtsjahr zwischen ${jahr - 120} und ${jahr} eingeben.`;
    }
  } else if (!/^[0-9]+$/.test(feld.value)) {
    fehler = "Bitte deine Play! Pokémon-Spieler-ID ausschließlich mit Ziffern eingeben.";
  }
  feld.setCustomValidity(fehler);
  feld.setAttribute("aria-invalid", String(Boolean(fehler)));
  document.querySelector(`#${feld.id}-fehler`).textContent = fehler;
}
for (const id of ["deck-geburtsjahr", "deck-spieler-id"]) {
  const feld = document.getElementById(id);
  feld.addEventListener("input", () => pruefePersoenlichesFeld(feld));
  feld.addEventListener("blur", () => pruefePersoenlichesFeld(feld));
}
function bereiteNachrichtVor() {
  if (!aktualisiereStatus()) return null;
  zeigePruefung();
  const geburtsjahr = document.querySelector("#deck-geburtsjahr");
  const spielerId = document.querySelector("#deck-spieler-id");
  pruefePersoenlichesFeld(geburtsjahr);
  pruefePersoenlichesFeld(spielerId);
  const nameInput = document.querySelector("#deck-name");
  const name = nameInput.value.trim();
  nameInput.setCustomValidity(name.split(/\s+/).length >= 2 ? "" : "Bitte Vor- und Nachname eingeben.");
  if (!formular.reportValidity()) return null;
  const kategorie = document.querySelector("#deck-kategorie").value;
  if (!["Junior", "Senior", "Master"].includes(kategorie)) return null;
  const nachricht = erstelleNachricht(decklistenTurnier, name, geburtsjahr.value, spielerId.value, kategorie, deckText.value);
  document.querySelector("#deck-nachricht").value = `Betreff: ${erstelleBetreff(decklistenTurnier, name)}\n\n${nachricht}`;
  document.querySelector("#deck-nachricht-bereich").hidden = false;
  return {name, nachricht};
}
formular.addEventListener("input", () => {
  document.querySelector("#deck-name").setCustomValidity("");
  document.querySelector("#deck-nachricht-bereich").hidden = true;
  document.querySelector("#deck-nachricht").value = "";
  aktionsStatus.textContent = "";
  zeigePruefung();
});
formular.addEventListener("submit", event => {
  event.preventDefault();
  const daten = bereiteNachrichtVor();
  if (!daten) return;
  aktionsStatus.textContent = "E-Mail-Programm angefordert. Bitte vollständige Nachricht prüfen und selbst versenden. Ein Eingang wurde nicht bestätigt.";
  window.location.href = erstelleMailLink(decklistenTurnier, daten.name, daten.nachricht);
});
document.querySelector("#deck-kopieren").addEventListener("click", async () => {
  const daten = bereiteNachrichtVor();
  if (!daten) return;
  try {
    await navigator.clipboard.writeText(document.querySelector("#deck-nachricht").value);
    aktionsStatus.textContent = "Nachricht kopiert. Bitte in eine E-Mail einfügen und selbst versenden.";
  } catch {
    const ausgabe = document.querySelector("#deck-nachricht"); ausgabe.focus(); ausgabe.select();
    aktionsStatus.textContent = "Automatisches Kopieren nicht möglich. Bitte die markierte Nachricht manuell kopieren.";
  }
});
aktualisiereStatus();
setInterval(aktualisiereStatus, 1000);
window.addEventListener("focus", aktualisiereStatus);
document.addEventListener("visibilitychange", aktualisiereStatus);
