# Sobre nosotros
ImageVeil es una aplicación que facilita el anonimato de tus fotos sin necesidad de software de edición de fotos.

Somos de la opinión de que todas personas tienen el derecho de no ser reconocido en las imágenes. En la era de los medios sociales, nunca se sabe quién verá esos fotos. Lamentablemente, aparte del complicado método con Photoshop y exiftool, casi no hay ningún software que trate las imágenes de forma realmente anónima. O la imagen se carga en un servidor en el que no se confía, o el sitio está lleno de anuncios, rastreadores y plugins de medios sociales. Es por eso que ponemos ImageVeil a disposición de todos aquellos que no quieren confiar en lo que un proveedor comercial hace con sus datos.

## Tus datos están seguros!
No almacenamos ningún dato personal tuyo! Además, la imagen no se archiva con nosotros. Inmediatamente después del procesamiento se desaparece y ni siquiera nosotros mismos podemos acceder a él. Ofrecemos ImageVeil sólo a través de SSL/TLS (https:// en la barra de direcciones de su navegador) y [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ([xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion)). En el caso de SSL/TLS, un tercero sólo puede ver que usted ha utilizado nuestra aplicación, no lo que ha hecho con ella. [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) tampoco muestra eso.

El código de ImageVeil se publica en [Github.com <i class="fab fa-github"></i>](https://github.com/zoku/image-veil) para que todos puedan hacerse una idea de lo que hacemos con los datos.

Tampoco utilizamos rastreadores, redes publicitarias o plugins de medios sociales. Si utiliza ImageVeil, en realidad sólo está conectado a nosotros.

## Hacemos las cosas de manera diferente!
Además de pixelar las áreas de imagen y eliminar metadatos, como las tablas EXIF, también intentamos evitar el análisis forense de imágenes que pueda identificar el chip de cámara exacto con el que se capturó la imagen (véase [Análisis de imágenes](analisis-de-imagenes)). Añadimos un ruido apenas visible y aleatorio a la imagen que superpone el ruido generado por el chip de la cámara, haciéndola invisible para el software de análisis. Además, reducimos el tamaño de las imágenes grandes. Esto dificulta aún más el análisis de imágenes.

Puede desactivar el ruido y la reducción de la imagen. Sin embargo, lo desaconsejamos salvo que sepas exactamente lo que estás haciendo.