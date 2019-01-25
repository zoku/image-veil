# Chi siamo
ImageVail è un'app che ti permette di anonimizzare facilmente le tue foto senza alcun software di elaborazione di immagini.

Crediamo che ogni persona abbia il diritto di non essere riconosciuta nelle foto. Nell'era dei social media non si puó mai sapere chi visualizzera un’immagine. Sfortunatamente, a parte il complicato utilizzo di Photoshop e exiftool, non c'è quasi nessun software che tratti le immagini in modo veramente anonimo. O l'immagine viene caricata su un server poco attendibile oppure il sito è pieno di annunci, tracker e plug-in di social media. Ecco perché forniamo ImageVeil a tutti quelli che non voglionoaffidare i propi dati ad operatori commerciali.

## I tuoi dati sono al sicuro!
Non salviamo alcuna informazione personale a tuo riguardo! Anche l’immagine non viene salvata. Non appena è stata modificata, viene cancellata e neppure noi abbiamo piú la possibilitá di accedervi. Offriamo ImageVeil solo attraverso SSL / TLS (https: // nella barra degli indirizzi del browser) e [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ([xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion)). Su SSL / TLS, terzi possono solo vedere che hai usato la nostra app ma non per cosa l’hai usata. Su [Tor <i class="fas fa-external-link-old"></i>](https://www.torproject.org) non si vede nemmeno questa informazione. 

Il codice di ImageVeil è accessibile sotto [Github.com <i class="fab fa-github"></i>](https://github.com/zoku/image-veil) , cosí che chiunque possa verificare cosa facciamo con i dati. 

Inoltre non utilizziamo servizi di localizzazione, reti pubblicitarie o plug-in di social media. Se usi ImageVeil, sei davvero connesso solo con noi.

## Ecco cosa facciamo diversamente!
Oltre a sfocare parti dell'immagine e a rimuovere i metadati, come per esempio le specifiche EXIF, cerchiamo anche di prevenire l'analisi forense delle immagini che potrebbe portare all’identificazione del chip della fotocamera che ha catturato l'immagine (vedi [Analisi immagine](analisi-immagine)). A tal fine, aggiungiamo all’immagine un rumore casuale appena visibile che si sovrappone al rumore che viene creato dal chip della fotocamera, rendendolo invisibile ai software di analisi. Inoltre, riduciamo le immagini di grandi dimensioni. Ciò rende un’analisi delle immagini ancora piú difficile.

È possibile disattivare sia l’aggiunta di un rumore che la riduzione dell'immagine. Peró vi sconsigliamo di farlo, a meno che non sappiate esattamente cosa state facendo.