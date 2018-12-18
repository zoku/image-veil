## Frequently asked questions (FAQ)
**Q**: Why do you not blur the images, like you do in the preview?
**A**: Simply bluring images is not save enough. It is still possible to "un-pixelate" the image. We only use coarse mosaic patterns to pixelate images to make a later de-pixelisation impossible.

**Q**: What about meta-data like the EXIF tables?
**A**: The app creates a completely new image. All meta-data is lost in the process (see [Image analysis](image-analysis?l=en)).

**Q**: Why do you host this app?
**A**:

**Q**: Can I use this via TOR?
**A**: Yes! The TOR-service is on ...

**Q**: Do you track?
**A**: No. We only save a timestamp to see if the app is used at all.

**Q**: Is my image secure?
**A**: Yes. It will only be uploaded for the processing and will not be saved anywhere on our servers.

**Q**: Can I contribute?
**A**: Sure! If you can program Kotlin or Javascript you can make a PullRequest on Github. You can also report errors or make suggestions.

**Q**: What data will be saved on you server?
**A**: Only a timestamp. All your data will stay yours and yours alone.

**Q**: In which browsers does this app work?
**A**:

|                | Chrome | Safari | Firefox\* | Opera | Internet Explorer | Edge |
|---------------:|:-------|:-------|:----------|:------|:------------------|:-----|
| Windows        | O      | -      | O         | O     | O                 | X    |
| Windows Mobile | ?      | -      | ?         | ?     | ?                 | ?    |
| MacOS          | O      | ?      | ?         | ?     | -                 | -    |
| Ubuntu         | ?      | -      | ?         | ?     | -                 | -    |
| Android        | O      | -      | X         | ?     | -                 | -    |
| iOS            | ?      | !      | ?         | ?     | -                 | -    |

O = Without limitations
! = With limitations
X = Not usable
? = Not tested

\*and TOR-Browser