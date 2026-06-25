# AEuP C# — Selbsttest zur Schulaufgabe

Statische Lern-/Selbsttest-Website zur Vorbereitung auf die Schulaufgabe im Fach
**Anwendungsentwicklung mit Programmierung (AEuP) – C#**. Abgedeckte Themen:

1. **Grundlagen** — Datentypen & Variablen, Typkonvertierung & Ein-/Ausgabe, Operatoren, Verzweigungen (`if`/`switch`), Schleifen
2. **Arrays** — ein- und mehrdimensionale Arrays, Index & Länge, SA-Aufgabe „Chaos-Lager"
3. **UML-Aktivitätsdiagramm** — Notation, Entscheidung/Vereinigung, Ticketkauf modellieren, Diagramm → Code

Umfang: **57 Aufgaben** (davon **18 Programmieraufgaben** aus den Übungs-Arbeitsblättern, nach Quelle getaggt),
**7 Diagramme**, zwei UML-Zeichenaufgaben mit togglebarer Musterlösung sowie eine **Probe-SA** mit Timer.

## Nutzung

`index.html` im Browser öffnen. Multiple-Choice- und Multi-Select-Fragen werden **automatisch ausgewertet**
(Punktestand oben rechts). Rechen-/Szenario-/Modellier-/Zeichenaufgaben bieten aufdeckbare **Musterlösungen**.

### Speichern, Drucken, Probe-SA
- **Fortschritt** (beantwortete Fragen, Code-Eingaben) wird lokal im Browser gespeichert (`localStorage`);
  je Themenseite gibt es einen Button „Fortschritt zurücksetzen".
- **Drucken/PDF:** `Strg/Cmd + P` blendet Bedienelemente aus, deckt alle Lösungen auf und macht die
  Zeichenaufgaben sauber druckbar (Print-Stylesheet).
- **Probe-SA** (`pruefung.html`): 15 Auswahlfragen über alle Themen, 30-Minuten-Countdown, automatische
  Auswertung mit gespeichertem Versuchsverlauf.

### Programmieraufgaben (statisch, kein Server)
Diese Seite ist rein statisch (GitHub Pages) und **führt keinen Code aus**. Bei Programmieraufgaben:
- Code in das Eingabefeld tippen,
- per **„KI-Bewertungs-Prompt kopieren"** einen fertigen Prompt (Aufgabe + dein Code + Bewertungskriterien)
  in die Zwischenablage legen und in eine KI (z. B. ChatGPT/Claude) einfügen, **oder**
- die **Musterlösung + Bewertungs-Checkliste** aufdecken und selbst vergleichen.

## Veröffentlichen über GitHub Pages
1. Diesen Ordner (Inhalt) in ein GitHub-Repository legen.
2. In den Repo-Einstellungen → *Pages* → Branch + Ordner als Quelle wählen.
3. Die `.nojekyll`-Datei sorgt dafür, dass der `assets/`-Ordner nicht von Jekyll gefiltert wird.

Keine externen Abhängigkeiten (keine CDNs/Fonts/Skripte) — funktioniert auch offline.

## Hinweis
Lernmaterial, KI-gestützt erstellt aus den Unterrichtsunterlagen des Workspace (Arbeitsblätter, SA-Übungen).
Ohne Gewähr auf Vollständigkeit/Richtigkeit — im Zweifel gelten die Original-Unterlagen und die Lehrkraft.
