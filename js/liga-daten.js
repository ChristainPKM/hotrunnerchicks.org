"use strict";

const saison = {
  "name": "Saison 2026/2027",
  "mindestTurniere": 12
};

const spielerListe = [
  {
    "id": "P001",
    "name": "Philip Düerkop",
    "kategorie": "Master"
  },
  {
    "id": "P002",
    "name": "Jason Schuck",
    "kategorie": "Master"
  },
  {
    "id": "P003",
    "name": "Max Thomä",
    "kategorie": "Master"
  },
  {
    "id": "P004",
    "name": "Sancho Bohnig",
    "kategorie": "Master"
  },
  {
    "id": "P005",
    "name": "Philipp Karsch",
    "kategorie": "Master"
  },
  {
    "id": "P006",
    "name": "Jasmin Müller",
    "kategorie": "Master"
  },
  {
    "id": "P007",
    "name": "Dominik Haagen",
    "kategorie": "Master"
  },
  {
    "id": "P008",
    "name": "Daniel Hackl",
    "kategorie": "Master"
  },
  {
    "id": "P009",
    "name": "Sebastian Nibu",
    "kategorie": "Master"
  },
  {
    "id": "P010",
    "name": "Janet Simon-Rehm",
    "kategorie": "Master"
  },
  {
    "id": "P011",
    "name": "Ruben Kaupert",
    "kategorie": "Master"
  },
  {
    "id": "P012",
    "name": "Fabio Bohnig",
    "kategorie": "Master"
  },
  {
    "id": "P013",
    "name": "Matthias Herbst",
    "kategorie": "Master"
  },
  {
    "id": "P014",
    "name": "Lars Rehm",
    "kategorie": "Senior"
  },
  {
    "id": "P015",
    "name": "Pablo Bohnig",
    "kategorie": "Master"
  },
  {
    "id": "P016",
    "name": "Benjamin Schneckenburger",
    "kategorie": "Master"
  },
  {
    "id": "P017",
    "name": "Aldwin Tedjo",
    "kategorie": "Master"
  },
  {
    "id": "P018",
    "name": "Sabrina Stöber",
    "kategorie": "Master"
  },
  {
    "id": "P019",
    "name": "Florian Schmidt",
    "kategorie": "Master"
  },
  {
    "id": "P020",
    "name": "Arda Altun",
    "kategorie": "Master"
  },
  {
    "id": "P021",
    "name": "Alexandre Filho",
    "kategorie": "Master"
  },
  {
    "id": "P022",
    "name": "Florian Steube",
    "kategorie": "Master"
  },
  {
    "id": "P023",
    "name": "Patrick Kreußel",
    "kategorie": "Master"
  },
  {
    "id": "P024",
    "name": "Jorik von der Weth",
    "kategorie": "Senior"
  },
  {
    "id": "P025",
    "name": "Jakob Denk",
    "kategorie": "Master"
  },
  {
    "id": "P026",
    "name": "Patrick Welther",
    "kategorie": "Master"
  },
  {
    "id": "P027",
    "name": "Melissa Welther",
    "kategorie": "Master"
  },
  {
    "id": "P028",
    "name": "Julian Haydt",
    "kategorie": "Master"
  },
  {
    "id": "P029",
    "name": "Julian Patz",
    "kategorie": "Master"
  },
  {
    "id": "P030",
    "name": "Fabian Liebold",
    "kategorie": "Master"
  },
  {
    "id": "P031",
    "name": "Simon Vogt",
    "kategorie": "Master"
  },
  {
    "id": "P032",
    "name": "Laurenz Schwemmlein",
    "kategorie": "Senior"
  },
  {
    "id": "P033",
    "name": "Marcel Schelhorn",
    "kategorie": "Master"
  },
  {
    "id": "P034",
    "name": "Christopher Hahn",
    "kategorie": "Master"
  },
  {
    "id": "P035",
    "name": "Finn Morgenroth",
    "kategorie": "Senior"
  },
  {
    "id": "P036",
    "name": "Ricado Keßler",
    "kategorie": "Master"
  },
  {
    "id": "P037",
    "name": "Pascal Werner",
    "kategorie": "Master"
  },
  {
    "id": "P038",
    "name": "Colin Bayer",
    "kategorie": "Senior"
  },
  {
    "id": "P039",
    "name": "Michael Köhn",
    "kategorie": "Master"
  },
  {
    "id": "P040",
    "name": "Sven von der Weth",
    "kategorie": "Master"
  },
  {
    "id": "P041",
    "name": "Christian Hartmann",
    "kategorie": "Master"
  },
  {
    "id": "P042",
    "name": "Christian Röblitz",
    "kategorie": "Master"
  },
  {
    "id": "P043",
    "name": "Daryl Karschnia",
    "kategorie": "Senior"
  },
  {
    "id": "P044",
    "name": "Marc Jackl",
    "kategorie": "Senior"
  },
  {
    "id": "P045",
    "name": "Max Pechauf",
    "kategorie": "Master"
  },
  {
    "id": "P046",
    "name": "Alfred Salim",
    "kategorie": "Master"
  },
  {
    "id": "P047",
    "name": "Julian Meißner",
    "kategorie": "Master"
  }
];

const veranstaltungen = [
  {
    "tdfTurnierId": "26-10-023182",
    "name": "Pokémon-Liga",
    "datum": "06.10.2026",
    "wertungen": [
      {
        "bezeichnung": "Wertung 2",
        "ergebnisse": [
          {
            "spielerId": "P012",
            "platz": 1
          },
          {
            "spielerId": "P041",
            "platz": 2
          },
          {
            "spielerId": "P037",
            "platz": 3
          },
          {
            "spielerId": "P007",
            "platz": 4
          },
          {
            "spielerId": "P042",
            "platz": 5
          },
          {
            "spielerId": "P040",
            "platz": 6
          },
          {
            "spielerId": "P030",
            "platz": 7
          },
          {
            "spielerId": "P002",
            "platz": 8
          },
          {
            "spielerId": "P015",
            "platz": 9
          },
          {
            "spielerId": "P046",
            "platz": 10
          },
          {
            "spielerId": "P009",
            "platz": 11
          },
          {
            "spielerId": "P004",
            "platz": 12
          }
        ]
      },
      {
        "bezeichnung": "Wertung 1",
        "ergebnisse": [
          {
            "spielerId": "P024",
            "platz": 1
          },
          {
            "spielerId": "P035",
            "platz": 2
          }
        ]
      }
    ]
  }
];
