# Frequently Asked Questions (FAQ)
**Q**: Why don’t you blur the images as previewed?
**A**: Simply blurring an image is not enough. Enough information remains to recover the image. Therefore, we only use coarse mosaic patterns and full colours to prevent the recovery of anonymised images.

**Q**: What happens to my image's meta-data (e.g. EXIF-tables)?
**A**: The application internally creates a new image, which only uses the images visual data. Further data, including meta data, are lost in the process (see [image analysis](image-analysis)).

**Q**: Why do you provide this application?
**A**: More information can be found in the [about us](about-us) section.

**Q**: Https is not secure enough for me! Can I use ImageVeil via [Tor](https://www.torproject.org)?
**A**: Yes! We have a Tor service under [xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion).

**Q**: Do you use tracking software?
**A**: No. We only save date and time of an editing process to maintain an overview on how often ImageVeil is used. We do *not* use any trackers, any Facebook-, Twitter-, or Google-plugins neither any advertisement network.

**Q**: Is my image safe with you?
**A**: Yes. It will be briefly stored in our server's memory while being edited and will be immediately deleted afterwards. Meanwhile, we cannot access your image.

**Q**: Am I able to contribute to your service?
**A**: Definitely! If you master Kotlin or Javascript, you can make a pull request on [Github](https://github.com/zoku/image-veil). Additionally, you can report errors and suggest improvements. For this, please use our [contact form](../contact).

**Q**: Which data are saved on your server?
**A**: Only date and time of editing your image (see [statistics](../statistics)). Your data is yours and yours alone!

**Q**: Which browsers support ImageVeil?
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

O = unrestricted
! = restricted
X = unusable
? = not tested