# Domande frequenti (FAQ)
**D**: Perché non redete le immagini sfocate, come nell'anteprima?
**R**: Redere sfocata parte dell’immagine non basta. Rimangono infatti abbastanza dati per ripristinare l'immagine. Usiamo solo strutture a mosaico larghe e colori pieni per rendere impossibile una ricostruzione dell’immagine.

**D**: Cosa succede con i metadati dell’immagine (per esempio le specifiche EXIF)?
**R**: La app crea al suo interno una nuova immagine e per fare ció utilizza solo i dati dell'immagine stessa. Tutti gli altri dati, metadati compresi, vengono cancellati (vedi [analisi immagine](analisi-immagine)).

**D**: Perché avete reso disponibile questa app?
**R**: Vedi quanto scriviamo nella sezione [chi siamo](chi-siamo)!

**D**: https non è abbastanza sicuro per me! Posso usare la app tramite [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org)?
**R**: Sì! Trovi il servizio Tor sotto [xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion).

**D**: Usate servizi di localizzazione?
**R**: No. Noi registriamo solo la data e l'ora di modifica delle immagini, per tenere traccia di quanto venga utilizzato ImageVeil. *Non* usiamo software di localizzazione, né plugin di Facebook, Twitter o Google e nemmeno reti pubblicitarie.

**D**: La mia foto è al sicuro con la vostra app?
**R**: Sì. L’immagine viene salvata solo una volta sui nostri server per breve tempo per permetterne la modifica e poi cancellata direttamente. A questo punto non abbiamo piú accesso all’immagine.

**D**: Posso contribuire alla app?
**R**: Certo! Se sai usare Kotlin, CSS o Javascript, puoi fare una pull request su [Github <i class="fab fa-github"></i>](https://github.com/zoku/image-veil). Puoi anche farci sapere se hai trovato errori o inviarci suggerimenti. Trovi il nostro indirizzo e-mail nell‘ [Impressum](impressum).

**D**: Quali dati vengono memorizzati sul server?
**R**: Solo la data e l'ora in cui l'immagine è stata modificata (vedi [statistica](../statistics)). I tuoi dati appartengono a te esclusivamente!

**D**: Su quali browser funziona la app?
**R**:
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
        <td>O</td>
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
        <td>!</td>
        <td>?</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td align="right"><i class="fab fa-edge"></i></td>
        <td>O</td>
        <td>?</td>
        <td>-</td>
        <td>?</td>
        <td>-</td>
        <td>O</td>
    </tr>
</table>

O = senza restrizioni
! = Con restrizioni
X = Non disponibile
? = Non testato