# MAÉI — webshop

Webshop voor MAÉI sieraden. Statische site (HTML, CSS, JavaScript), te hosten op GitHub Pages.

## Aanpassen
- `config.js` — e-mailadres, Instagram, verzendkosten, gratis verzending vanaf, betalen aan/uit.
- `products.js` — de collectie: naam, categorie, prijs, kleuren (goud/zilver), tekst en foto.
  Zet een productfoto in de map en vul de bestandsnaam in bij `foto`. Zonder foto toont de site een illustratie.
- `logo.svg` — het logo (kompasroos met M).
- `zakje.jpg` — de foto van het fluwelen zakje op de startpagina.

## Bestellen en betalen
- Zolang `email` leeg is en `betalenActief` op `false` staat, kunnen bezoekers alles bekijken en in hun winkelmandje leggen, maar nog niet bestellen.
- Met een `email` ingevuld wordt een bestelling als e-mail naar de winkel gestuurd (bestelaanvraag).
- Online betalen (iDEAL, creditcard, Bancontact) via Stripe of Mollie volgt zodra er een account is.
