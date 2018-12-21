package net.imageveil.app.transformers

import com.drew.metadata.Metadata
import com.drew.metadata.exif.ExifIFD0Directory
import org.imgscalr.Scalr
import org.slf4j.LoggerFactory
import java.awt.image.BufferedImage

/**
 * Created by Manuel Helbing on 2018-12-16.
 */
class Rotate(private val metaData: Metadata) : Transformer {
    private val logger = LoggerFactory.getLogger("Transformers - Rotate")

    override fun transform(image: BufferedImage): BufferedImage {
        val exifDir = metaData.getFirstDirectoryOfType(ExifIFD0Directory::class.java)

        if (exifDir.containsTag(0x112)) {
            val orientation = exifDir.getInt(0x112)

            when (orientation) {
                ImageOrientations.LANDSCAPE_0_O -> return image
                ImageOrientations.LANDSCAPE_0_M -> return Scalr.rotate(image, Scalr.Rotation.FLIP_HORZ)
                ImageOrientations.LANDSCAPE_90_O -> return rotate(image, 90)
                ImageOrientations.LANDSCAPE_90_M -> return Scalr.rotate(rotate(image, 90), Scalr.Rotation.FLIP_HORZ)
                ImageOrientations.LANDSCAPE_180_O -> return rotate(image, 180)
                ImageOrientations.LANDSCAPE_180_M -> return Scalr.rotate(rotate(image, 180), Scalr.Rotation.FLIP_HORZ)
                ImageOrientations.LANDSCAPE_270_O -> return rotate(image, 270)
                ImageOrientations.LANDSCAPE_270_M -> return Scalr.rotate(rotate(image, 270), Scalr.Rotation.FLIP_HORZ)
                else -> logger.warn("Unknown image orientation: $orientation")
            }
        }
        return image
    }

    private fun rotate(image: BufferedImage, deg: Int): BufferedImage {
        return when (deg) {
            0 -> image
            90 -> Scalr.rotate(image, Scalr.Rotation.CW_90)
            180 -> Scalr.rotate(image, Scalr.Rotation.CW_180)
            270 -> Scalr.rotate(image, Scalr.Rotation.CW_270)
            else -> image
        }
    }

    private object ImageOrientations {
        const val LANDSCAPE_0_O = 1
        const val LANDSCAPE_0_M = 2

        const val LANDSCAPE_90_O = 6
        const val LANDSCAPE_90_M = 5

        const val LANDSCAPE_180_O = 3
        const val LANDSCAPE_180_M = 4

        const val LANDSCAPE_270_O = 8
        const val LANDSCAPE_270_M = 7
    }
}