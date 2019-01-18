# Frequently asked questions (FAQ)
**Q**: Why don't you blur the images, like in the preview?
**A**: Simply bluring an image is not quite enough. In blured images, enough information remains to recover most of it's details. Therefor we only use coarse mosaic patterns and plain colors to securely prevent a recovery of the anonymised portions of an image. 

**Q**: What happens to my image's meta-data (e.g. EXIF-tables)?
**A**: The application creates a new image internally, which only uses the images visual data. All other data, including meta data, is lost in the process (see [image analysis](image-analysis)).

**Q**: Why do you provide this application?
**A**: Read what we're writing [about us](about-us).

**Q**: Https is not secure enough for me! Can I use ImageVeil via [Tor <i class="fas fa-external-link-alt"></i>](https://www.torproject.org)?
**A**: Yes! We have a Tor service on [xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion](http://xdnjs7n2hlr53h22mm3cgudowl3vyi2jvvrubopomlkb2njiotfjacyd.onion).

**Q**: Do you use tracking software?
**A**: No. We only save date and time of an editing process to maintain an overview on how well ImageVeil is received. We use *no* trackers, *no* Facebook-, Twitter-, or Google-plugins and *no* advertisement network.

**Q**: Is my image safe with you?
**A**: Yes. It will be in our server's memory briefly while being edited and deleted immediately afterwards. In the meantime we cannot access your image.

**Q**: Can I contribute?
**A**: Sure! If you know Kotlin or Javascript, you can make a pull request on [Github <i class="fab fa-github"></i>](https://github.com/zoku/image-veil). You can also report errors and suggest improvements. Use our [contact form](../contact).

**Q**: What data is saved on your server?
**A**: Only date and time when you edited your image (see [statistics](../statistics)). Your data is your's and your's alone!

**Q**: In which browsers does ImageVeil run?
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

O = Without limitations
! = With limitations
X = Not usable
? = Not tested