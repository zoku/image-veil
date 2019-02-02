# Über uns
ImageVeil ist eine App, mit der du ganz einfach und ohne Bildbearbeitungssoftware deine Fotos anonymisieren kannst.

Wir sind der Meinung, dass jeder Mensch ein Recht darauf hat, auf Bildern unerkannt zu bleiben. Im Zeitalter der sozialen Medien weiß man nie, wer so ein Foto zu sehen bekommt. Leider gibt es neben der komplizierten Methode mit Photoshop und exiftool kaum eine Software, die Bilder wirklich anonym behandelt. Entweder wird das Bild auf einen Server hochgeladen, der nicht vertrauenswürdig ist, oder die Website ist voller Werbung, Tracker und Social Media Plugins. Darum stellen wir ImageVeil allen zur Verfügung, die sich nicht darauf verlassen wollen, was ein kommerzieller Anbieter mit ihren Daten macht.

## Deine Daten sind sicher!
Wir speichern keine persönlichen Daten von dir! Auch das Bild wird bei uns nicht gespeichert. Direkt nach der Bearbeitung ist es wieder weg und nicht einmal wir selbst können darauf zugreifen. Wir bieten ImageVeil nur über SSL/TLS (https:// in der Adresszeile deines Browsers) und [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ([xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion)) an. Über SSL/TLS kann eine außenstehende Partei nur sehen, dass du unsere App benutzt hast, nicht was du damit getan hast. Über [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ist auch das nicht ersichtlich.

Der Code von ImageVeil ist unter [Github.com <i class="fab fa-github"></i>](https://github.com/zoku/image-veil) veröffentlicht, damit sich jeder Mensch selbst ein Bild davon machen kann, was wir mit den Daten tun.

Außerdem benutzen wir keine Tracker, Werbenetzwerke oder Social Media Plugins. Wenn du ImageVeil benutzt, bist du wirklich nur mit uns verbunden.

## Wir machen einiges anders!
Zusätzlich zur Verpixelung von Bildbereichen und dem Entfernen von Metadaten, wie z.B. den EXIF-Tabellen, versuchen wir, auch einer forensischen Bildanalyse vorzubeugen, die den genauen Kamerachip identifizieren könnte, mit dem das Bild aufgenommen wurde (siehe [Bildanalyse](bildanalyse)). Hierzu fügen wir ein kaum sichtbares, zufälliges Rauschen zum Bild hinzu, dass das Rauschen, was durch den Chip der Kamera entsteht, überlagert und so für die Analysesoftware unsichtbar macht. Zusätzlich verkleinern wir große Bilder. Dadurch wird es noch schwieriger, eine Bildanalyse zu machen.

Du kannst sowohl das Rauschen, als auch die Verkleinerung des Bildes ausschalten. Davon raten wir allerdings ab, außer du weißt genau, was du tust.