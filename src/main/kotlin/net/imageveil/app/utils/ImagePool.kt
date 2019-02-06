package net.imageveil.app.utils

import java.time.LocalDateTime

@Deprecated("DO NOT USE FOR SECURITY REASONS!!")
object ImagePool : HashMap<String, ImagePool.ImagePoolImage>() {
    data class ImagePoolImage(
            val image: ByteArray,
            val expires: LocalDateTime,
            var previewed: Boolean = false
    ) {
        override fun equals(other: Any?): Boolean {
            if (this === other) return true
            if (javaClass != other?.javaClass) return false

            other as ImagePoolImage

            if (!image.contentEquals(other.image)) return false
            if (expires != other.expires) return false
            if (previewed != other.previewed) return false

            return true
        }

        override fun hashCode(): Int {
            var result = image.contentHashCode()
            result = 31 * result + expires.hashCode()
            result = 31 * result + previewed.hashCode()
            return result
        }
    }
}