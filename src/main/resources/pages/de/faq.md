# Häufig gestellte Fragen (FAQ)
**F**: Warum lasst ihr die Bilder nicht verschwimmen, wie in der Vorschau?
**A**: Einen Bildbereich einfach verschwimmen zu lassen reicht nicht. Es bleiben dabei genügend Daten übrig, um das Bild wiederherzustellen. Wir nutzen nur grobe Mosaikstrukturen und Vollfarben, um eine Wiederherstellung des Bildes unmöglich zu machen.

**F**: Was passiert mit den Metadaten des Bildes (z.B. EXIF-Tabellen)?
**A**: Die Anwendung erstellt intern ein neues Bild und nutzt dafür nur die Bilddaten selbst. Alle anderen Daten, wie auch Metadaten, gehen verloren (siehe [Bildanalyse](bildanalyse)).

**F**: Warum stellt ihr diese Anwendung zur Verfügung?
**A**: Schau, was wir [über uns](ueber-uns) schreiben!

**F**: Https ist mir nicht sicher genug! Kann ich die Anwendung auch mit [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) nutzen?
**A**: Ja! Der Tor-Service liegt unter [xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion).

**F**: Benutzt ihr Tracker?
**A**: Nein. Wir speichern ausschließlich Datum und Uhrzeit einer Bildbearbeitung, um einen Überblick zu behalten, wie gut ImageVeil genutzt wird. Wir nutzen *keine* Tracking-Software, *keine* Facebook-, Twitter- oder Google-Plugins und *kein* Werbenetzwerk.

**F**: Ist mein Bild bei euch sicher?
**A**: Ja. Es wird nur ein Mal zur Bearbeitung kurzzeitig im Speicher unseres Servers abgelegt und hinterher direkt wieder gelöscht. Wir können dabei nicht auf das Bild zugreifen.

**F**: Kann ich mich beteiligen?
**A**: Natürlich! Wenn du Kotlin, CSS oder Javascript beherrschst, kannst du gern einen Pull Request bei [Github <i class="fab fa-github"></i>](https://github.com/zoku/image-veil) machen. Du kannst uns auch gerne über Fehler informieren und Anregungen schicken. Nutze dazu unser [Kontaktformular](contact).

**F**: Welche Daten werden auf dem Server gespeichert?
**A**: Nur Datum und Uhrzeit, wann ein Bild bearbeitet wurde (s. [Statistik](../statistics)). Alle deine Daten gehören nur dir allein.

**F**: In welchen Browsern funktioniert ImageVeil?
**A**:
<table>
    <tr>
        <th></th>
        <th><i class="fab fa-windows"></i></th>
        <th>WinM</th>
        <th><i class="fab fa-apple"></i></th>
        <th>iOS</th>
        <th><i class="fab fa-ubuntu"></i></th>
        <th><i class="fab fa-android"></i></th>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-chrome"></i></td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>O</td>
        <td>O</td>
        <td>O</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-firefox"></i></td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>O</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-safari"></i></td>
        <td>-</td>
        <td>-</td>
        <td>O</td>
        <td>?</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td align="right">Tor</td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>!</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-opera"></i></td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>?</td>
        <td>O</td>
        <td>O</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-internet-explorer"></i></td>
        <td>O</td>
        <td>?</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-edge"></i></td>
        <td>X</td>
        <td>?</td>
        <td>-</td>
        <td>?</td>
        <td>-</td>
        <td>O</td>
    </tr>
</table>

O = Uneingeschränkt
! = Mit Einschränkungen
X = Nicht nutzbar
? = Nicht getestet