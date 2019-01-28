# About Us
ImageVeil is an app for the effortless anonymisation of pictures, without needing to use an image processing software. 

It is our belief that every person has a right to stay unrecognisable on pictures. In the era of social media, it is hard to control who can see your photos. Unfortunately, there are only few applications which treat photos anonymously  besides the complicated methods with Photoshop and exiftool. Either the image is uploaded to an untrustworthy server or the website is full of ads, tracking software and social media plugins. Therefore, we provide ImageVeil which is for anyone not wanting to rely on a commercial provider's good intentions.

## Your data are safe with us!
We do not save any personal data! The images you anonymise are not saved either. After editing, they are going to be deleted immediately and it is impossible for us to access them. We offer ImageVeil solely via SSL/TLS (https:// in the address bar of your browser) and [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) ([xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion)). Thanks to SSL/TLS, a third party can only see that you are using our app but not what you have been doing while using it. And with [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org) even that is impossible.

ImageVeil's code is open source and publicly available on [Github.com <i class="fab fa-github"></i>](https://github.com/zoku/image-veil), which means everyone can convince themselves that we do not misuse the data.

Apart from that we do not use any trackers, ad networks or social media plugins. You are directly connected with us while using ImageVeil.

## We do things differently!
In addition to the pixelization of areas, we remove all metadata like EXIF-tables and do our best to prevent forensic image analysis from identifying the camera chip used for taking the picture (see [image analysis](image-analysis)). To achieve this, we apply a barely visible and random noise pattern to your image which conceals the inherent noise of the camera chip and thus turns it invisible for any analysis software. We also resize large images. This will make a forensic analysis harder or even impossible.

You can turn off both, noise and resizing, however we strongly discourage you from doing this unless you really know, what you are doing.