## Häufig gestellte Fragen (FAQ)
**F**: Warum lasst ihr die Bilder nicht verschwimmen, wie in der Vorschau?
**A**: Einen Bildbereich einfach verschwimmen zu lassen reicht nicht. Es bleiben dabei genügend Daten übrig, um das Bild wiederherzustellen. Wir nutzen nur grobe Mosaikstrukturen und Vollfarben, um eine Wiederherstellung des Bildes unmöglich zu machen.

**F**: Was passiert mit den Metadaten des Bildes (z.B. EXIF-Tabellen)?
**A**: Die Anwendung erstellt intern ein neues Bild und nutzt dafür nur die Bilddaten selbst. Alle anderen Daten, wie auch Metadaten gehen verloren (siehe [Bildanalyse](bildanalyse?l=de)).

**F**: Warum stellt ihr diese Anwendung zur Verfügung?
**A**: Wir sind der Meinung, dass jeder Mensch ein Recht darauf hat, auf Bildern unerkannt zu bleiben. Im Zeitalter der sozialen Medien weiß man nie, wer so ein Foto zu sehen bekommt. Leider gibt es, neben der komplizierten Methode mit Photoshop und exiftool, kaum eine Software, die Bilder wirklich anonym behandelt. Entweder wird das Bild auf einen Server hoch geladen, der nicht vertrauenswürdig ist oder die Website ist voll Werbung, Tracker und Social Media Plugins. Darum stellen wir diese Software hier zur Verfügung.

**F**: Https ist mir nicht sicher genug! Kann ich die Anwendung auch mit TOR nutzen?
**A**: Ja! Der TOR-Service liegt unter [eygnd6udnfwfo4ea.onion](http://eygnd6udnfwfo4ea.onion).

**F**: Benutzt ihr tracker?
**A**: Nein. Wir speichern ausschließlich Datum und Uhrzeit einer Bildbearbeitung, um einen Überblick zu behalten, wie gut ImageVeil genutzt wird. Wir nutzen *keine* Tracking-Software, *keine* Facebook-, Twitter- oder Google-Plugins und *kein* Werbenetzwerk.

**F**: Ist mein Bild bei euch sicher?
**A**: Ja. Es wird nur ein Mal zur Bearbeitung kurzzeitig im Speicher underes Servers abgelegt und hinterher direkt wieder gelöscht. Wir können dabei nicht auf das Bild zugreifen.

**F**: Kann ich mich beteiligen?
**A**: Natürlich! Wenn du Kotlin, CSS oder Javascript beherrschst, kannst du gern einen PullRequest bei Github machen. Du kannst uns auch gerne über Fehler informieren und Anregungen schicken. Die Mailadresse steht im [Impressum](impressum?l=de).

**F**: Welche Daten werden auf dem Server gespeichert?
**A**: Nur Datum und Uhrzeit, wann ein Bild bearbeitet wurde. Alle deine Daten gehören nur dir allein.

**F**: In welchen Browsern funktioniert die app?
**A**:

|                | Chrome | Safari | Firefox\* | Internet Explorer | Edge | Opera |
|---------------:|:-------|:-------|:--------|:------------------|:-----|:------|
| Windows        | O      | ?      | O       | ?                 | ?    | ?     |
| MacOS          | O      | ?      | ?       | ?                 | ?    | ?     |
| Ubuntu         | ?      | ?      | ?       | ?                 | ?    | ?     |
| Android        | O      | ?      | X       | ?                 | ?    | ?     |
| iOS            | ?      | !      | ?       | ?                 | ?    | ?     |
| Windows Mobile | ?      | ?      | ?       | ?                 | ?    | ?     |

O = Uneingeschränkt
! = Mit Einschränkungen
X = Nicht nutzbar
? = Nicht getestet

\*und TOR-Browser