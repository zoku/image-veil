# About us
ImageVeil is an App for effortless anonymisation of pictures, without the need to know image editing software.

We beleve, every human has a right to stay unrecognised on pictures. In the age of social media you never know, who might see your photos. Unfortunately, aside the complicated method with Photoshop and exiftool, there are few providers who treat your pictures truly anonymously. Either the image is uploaded to an untrustworthy server or the website is full of ads, tracking software and social media plugins. That's why we provide ImageVeil to everyone who cannot or would not rely on a commercial provider's good intentions.

## Your data is safe with us!
We do not save any personal data! Even the images you anonymise are not saved. After editing, it will be deleted immediately and not even we can access it, in the meantime. We provide ImageVeil only via SSL/TLS (https:// in the address bar of your browser) and [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ([xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion)). With SSL/TLS a third party can only see you using our app, but not what you did with it. With [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) even this is impossible.

ImageVeil's code is open source and publicly available on [Github.com <i class="fab fa-github"></i>](https://github.com/zoku/image-veil), so everyone can convince themself that we do not misuse any of your data.

Also we do not use any trackers, ad networks or social media plugins. When using ImageVeil, you are connected only with us.

## We do things differently!
Additional to pixelisation of areas, we remove all metadata like e.g. the EXIF-tables and we try our best to prevent forensic image analysis, which can identify the unique camera chip used to take the picture (see [image analysis](image-analysis)). To do this, we add a barely visible, random noise pattern to your image, which overlays the inherent noise of your camera's chip. This will make a forensic analysis harder or even impossible. We also resize large images to further aggrabate image analysis.

Of course you can turn off both noise and resizing, but we strongly discurrage you to do this unless you really know, what you are doing.