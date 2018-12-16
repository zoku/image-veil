package io.zoku.anonimage.transformers

import io.zoku.anonimage.model.Area
import io.zoku.anonimage.utils.Config
import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import kotlin.math.roundToInt

class Pixeliser(private val areas: ArrayList<Area>, private val scaleX: Float, private val scaleY: Float) : Transformer {
    override fun run(image: BufferedImage): BufferedImage {
        val squareLength = ((if (image.width > image.height) image.width else image.height) * Config.pixeliser_squareMosaic_squareSize).roundToInt()

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
        squaredG2D.dispose()

        val g2d = image.graphics as Graphics2D
        areas.forEach { area ->
            if (area.width > 0 && area.height > 0) {
                val areaImage = squaredImage.getSubimage((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
                g2d.drawImage(areaImage, (area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), null)
            }
        }
        g2d.dispose()

        return image
    }
}