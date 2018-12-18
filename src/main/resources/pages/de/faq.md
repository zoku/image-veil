## Häufig gestellte Fragen (FAQ)
**F**: Warum lasst ihr die Bilder nicht verschwimmen, wie in der Vorschau?
**A**: Einen Bildbereich einfach verschwimmen zu lassen reicht nicht. Es bleiben dabei genügend Daten übrig, um das Bild wiederherzustellen. Wir nutzen nur grobe Mosaikstrukturen und Vollfarben, um eine Wiederherstellung des Bildes unmöglich zu machen.

**F**: Was passiert mit den Metadaten des Bildes (z.B. EXIF-Tabellen)?
**A**: Die Anwendung erstellt intern ein neues Bild und nutzt dafür nur die Bilddaten selbst. Alle anderen Daten, wie auch Metadaten gehen verloren (siehe [Bildanalyse](bildanalyse)).

**F**: Warum stellt ihr diese Anwendung zur Verfügung?
**A**: Schau, was wir [über uns](ueber-uns) schreiben!

**F**: Https ist mir nicht sicher genug! Kann ich die Anwendung auch mit TOR nutzen?
**A**: Ja! Der TOR-Service liegt unter [eygnd6udnfwfo4ea.onion](http://eygnd6udnfwfo4ea.onion).

**F**: Benutzt ihr tracker?
**A**: Nein. Wir speichern ausschließlich Datum und Uhrzeit einer Bildbearbeitung, um einen Überblick zu behalten, wie gut ImageVeil genutzt wird. Wir nutzen *keine* Tracking-Software, *keine* Facebook-, Twitter- oder Google-Plugins und *kein* Werbenetzwerk.

**F**: Ist mein Bild bei euch sicher?
**A**: Ja. Es wird nur ein Mal zur Bearbeitung kurzzeitig im Speicher underes Servers abgelegt und hinterher direkt wieder gelöscht. Wir können dabei nicht auf das Bild zugreifen.

**F**: Kann ich mich beteiligen?
**A**: Natürlich! Wenn du Kotlin, CSS oder Javascript beherrschst, kannst du gern einen PullRequest bei Github machen. Du kannst uns auch gerne über Fehler informieren und Anregungen schicken. Die Mailadresse steht im [Impressum](impressum).

**F**: Welche Daten werden auf dem Server gespeichert?
**A**: Nur Datum und Uhrzeit, wann ein Bild bearbeitet wurde. Alle deine Daten gehören nur dir allein.

**F**: In welchen Browsern funktioniert die app?
**A**:

|                | Chrome | Safari | Firefox | TOR | Opera | Internet Explorer | Edge |
|---------------:|:-------|:-------|:--------|:----|:------|:------------------|:-----|
| Windows        | O      | -      | O       | O   | O     | O                 | X    |
| Windows Mobile | ?      | -      | ?       | ?   | ?     | ?                 | ?    |
| MacOS          | O      | O      | O       | O   | O     | -                 | -    |
| Ubuntu         | ?      | -      | ?       | ?   | ?     | -                 | -    |
| Android        | O      | -      | O       | !   | O     | -                 | O    |
| iOS            | ?      | !      | ?       | ?   | ?     | -                 | -    |

O = Uneingeschränkt
! = Mit Einschränkungen
X = Nicht nutzbar
? = Nicht getestet