package net.imageveil.app.utils

import java.nio.ByteBuffer
import java.security.SecureRandom
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object Crypt {
    /*
    * Code adapted to Kotlin from:
    * https://proandroiddev.com/security-best-practices-symmetric-encryption-with-aes-in-java-7616beaaade9
    * */
    fun encrypt(plainText: ByteArray): CipherMessage {
        val secureRandom = SecureRandom()
        val key = ByteArray(16)
        secureRandom.nextBytes(key)
        val secretKey = SecretKeySpec(key, "AES")

        val iv = ByteArray(12)
        secureRandom.nextBytes(iv)

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val parameterSpec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec)

        val cipherText = cipher.doFinal(plainText)

        val byteBuffer = ByteBuffer.allocate(4 + iv.size + cipherText.size)
        byteBuffer.putInt(iv.size)
        byteBuffer.put(iv)
        byteBuffer.put(cipherText)
        val cipherMessage = byteBuffer.array()

        /*
        * Originally the key was overridden here, but I need it to be sent to the user.
        * The point is to make the volatile image database (ImagePool) useless, even if you guess a valid image-link.
        * Without the correct key, an image cannot be retrieved via /imagesender servlet.
        *
        * This is NOT intended to be secure storage! Images will be deleted after download or after a fixed period of time.
        * In the event of a server restart, all images in ImagePool will be lost!
        * */
        // Arrays.fill(key, 0.toByte())

        return CipherMessage(key, cipherMessage)
    }

    fun decrypt(cipherMessage: ByteArray, key: ByteArray): ByteArray {
        val byteBuffer = ByteBuffer.wrap(cipherMessage)
        val ivLength = byteBuffer.int

        if (ivLength < 12 || ivLength > 16) {
            throw Exception("Invalid IV length!")
        }

        val iv = ByteArray(ivLength)
        byteBuffer.get(iv)
        val cipherText = ByteArray(byteBuffer.remaining())
        byteBuffer.get(cipherText)

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, SecretKeySpec(key, "AES"), GCMParameterSpec(128, iv))

        return cipher.doFinal(cipherText)
    }

    data class CipherMessage(
            val key: ByteArray,
            val message: ByteArray
    ) {
        override fun equals(other: Any?): Boolean {
            if (this === other) return true
            if (javaClass != other?.javaClass) return false

            other as CipherMessage

            if (!key.contentEquals(other.key)) return false
            if (!message.contentEquals(other.message)) return false

            return true
        }

        override fun hashCode(): Int {
            var result = key.contentHashCode()
            result = 31 * result + message.contentHashCode()
            return result
        }
    }
}