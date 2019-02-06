# Preguntas Frecuentes (FAQ)
**P:** ¿Por qué no borras las fotos, como en la vista previa?
**R:** No basta con desenfocar un área de la imagen. Quedarán suficientes datos para restaurar la imagen. Sólo utilizamos estructuras de mosaico en bruto y a todo color para que sea imposible restaurar la imagen.

**P:** ¿Qué ocurre con los metadatos de la imagen (por ejemplo, tablas EXIF)?
**R:** La aplicación crea una nueva imagen internamente y sólo utiliza los datos de la imagen en sí. Todos los demás datos, así como los metadatos, se perderán (véase [Análisis de imágenes](analisis-de-imagenes)).

**P:** ¿Por qué proporcionan esta aplicación?
**R:** ¡Mira lo que escribimos [sobre nosotros](sobre-nosotros)!

**P:** ¡Https no es lo suficientemente seguro para mí! ¿Puedo usar también la aplicación con [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org)?
**R:** ¡Sí! El servicio de Tor está bajo [xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion).

**P:** ¿Utilizan rastreadores?
**R:** No. Sólo almacenamos la fecha y la hora de una sesión de edición de imágenes para hacer un seguimiento de lo bien que se está utilizando ImageVeil. No utilizamos software de rastreo, Facebook, Twitter o plug-ins de Google, ni redes publicitarias.

**P:** ¿Está segura mi foto contigo?
**R:** Sí. Sólo se almacena una vez para su procesamiento breve en la memoria de nuestro servidor y se borra después directamente de nuevo. No podemos acceder a la imagen en el proceso.

**P:** ¿Puedo participar?
**R:** ¡Claro! Si conoces Kotlin, CSS o Javascript, le invitamos a realizar una solicitud de pull en [Github <i class="fab fa-github"></i>](https://github.com/zoku/image-veil). También puede informarnos sobre errores y enviarnos propuestas. La dirección de correo electrónico se encuentra en [la pie de imprenta](pie-de-imprenta).

**P:** ¿Qué datos se almacenan en el servidor?
**R:** Sólo la fecha y la hora en que se editó una imagen. Todos tus datos le pertenecen únicamente a ti.

**P:** ¿En qué navegadores funciona la aplicación?
**R:**
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

O = Sin restricciones
! = Con restricciones
X = No utilizable
? = No examinado