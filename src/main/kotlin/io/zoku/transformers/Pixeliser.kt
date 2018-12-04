package io.zoku.transformers

import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage

object Pixeliser {
    fun squaredImage(image: BufferedImage): BufferedImage {
        val squareLength = if (image.width > image.height) image.width / 100 else image.height / 100

        val squaredImage = BufferedImage(image.width, image.height, BufferedImage.TYPE_INT_RGB)
        val squaredG2D = squaredImage.graphics as Graphics2D
        for (sqX in 0 until squaredImage.width - squareLength step squareLength) {
            for (sqY in 0 until squaredImage.height - squareLength step squareLength) {
                var r = 0
                var g = 0
                var b = 0
                var pixels = 0

                for(imX in sqX until sqX + squareLength - 1) {
                    for(imY in sqY until sqY + squareLength - 1) {
                        val currentPixel = Color(image.getRGB(imX, imY))
                        r += currentPixel.red
                        g += currentPixel.green
                        b += currentPixel.blue
                        pixels++
                    }
                }

                val medianR = r / pixels
                val medianG = g / pixels
                val medianB = b / pixels

                squaredG2D.color = Color(medianR, medianG, medianB)
                squaredG2D.fillRect(sqX, sqY, squareLength, squareLength)
            }
        }

        return squaredImage
    }
}