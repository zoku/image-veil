## Anleitung
### Anonymisierung
Du kannst ImageVeil entweder mit der Maus oder auf Geräten mit Touchscreen mit dem Finger bedienen.

1. Wähle die gestrichelte Fläche an und wähle im folgenden Dialog eine Datei oder ziehe eine Bilddatei (im Moment unterstützen wir nur Dateien vom Typ JPEG) darauf.
1. Klicke oder tippe auf das Vorschaubild, um eine oder mehrere Verpixelungsflächen hinzu zu fügen. Du kannst diese an den Seiten größer und kleiner ziehen, an der Flächenmitte verschieben und mit dem "X"-Knopf in der rechten, oberen Ecke der Fläche löschen.
1. (Optional) In der linken oberen Ecke kannst du nun den Optionsdialog öffnen. Hier kannst du z.B. die Verpixelungsart wählen oder Anonymisierungsmethoden ein- oder ausschalten. Die Voreinstellungen sind sicher!
1. Wähle den Knopf 'Anonymisieren!', um den anonymisierungsvorgang zu starten. Dein Bild wird dann auf unseren Server geladen und bearbeitet.
1. Wenn der Bearbeitungsvorgang fertig ist, wird dir das anonymisierte Bild angezeigt. Um es zu speichern kannst du mit der rechten Maustaste darauf klicken und 'Bild speichern unter...' wählen bzw. das Bild mit dem Finger gedrückt halten und es auf deinem Gerät speichern.

### Deine Daten sind sicher!
Wir speichern keine persönlichen Daten von dir! Auch das Bild wird nicht bei uns gespeichert. Direkt nach der Bearbeitung ist es wieder weg und nicht einmal wir selbst können darauf zugreifen. Wir bieten ImageVeil nur über SSL/TLS (https:// in der Adresszeile deines Browsers) und TOR an. Über SSL/TLS kann eine außenstehende Partei nur sehen, dass du unsere App benutzt hast, nicht was du damit getan hast. Über TOR ist auch das nicht ersichtlich.
Der Code des Service ist unter Github.com veröffentlicht, damit sich jeder Mensch selbst ein Bild davon machen kann, was wir mit den Daten tun.
Außerdem benutzen wir keine Tracker, Werbenetzwerke oder social media buttons. Wenn du ImageVeil benutzt, bist du wirklich nur mit uns verbunden.

### Wir machen einiges anders!
Zusätzlich zur Verpixelung von Bildbereichen und dem Entfernen von Metadaten, wie z.B. den EXIF-Tabellen, versuchen wir auch einer forensischen Bildanalyse vorzubeugen, die den genauen Kamerachip identifizieren könnte, mit dem das Bild aufgenommen wurde (siehe [Bildanalyse](bildanalyse?l=de)). Hierzu fügen wir ein kaum sichtbares, zufälliges Rauschen zum Bild hinzu, das das Rauschen, was durch den Chip der Kamera entsteht überlagert und so für die Analysesoftware unsichtbar macht. Zusätzlich verkleinern wir große Bilder. Dadurch wird es noch schwieriger, eine Bildanalyse zu machen.
Du kannst sowohl das Rauschen, als auch die Verkleinerung des Bildes ausschalten. Davon raten wir allerdings ab, außer du weißt genau, was du tust.