package io.zoku.anonimage.transformers

import java.awt.Color
import java.awt.image.BufferedImage
import kotlin.math.roundToInt

object Randomiser {
    private const val percentageToRandomise = .50
    private const val intensityOfRandomisation = 30

    fun randomiseImage(image: BufferedImage): BufferedImage {
        val pixelCount = image.width * image.height
        val randomiseCount = (pixelCount * percentageToRandomise).roundToInt()

        val allPixels = arrayListOf<Pixel>()
        for (x in 0 until image.width) {
            for (y in 0 until image.height) {
                allPixels.add(Pixel(x, y))
            }
        }
        allPixels.shuffle()

        val randomPixels = allPixels.subList(0, randomiseCount)

        randomPixels.forEach { pixel ->
            val originalColor = Color(image.getRGB(pixel.x, pixel.y))

            var red = originalColor.red
            var green = originalColor.green
            var blue = originalColor.blue

            val direction = Math.random().roundToInt()

            when ((Math.random() * 2).roundToInt()) {
                0 -> { // R
                    if (direction == 1) {
                        red += (Math.random() * intensityOfRandomisation).roundToInt()
                    } else {
                        red -= (Math.random() * intensityOfRandomisation).roundToInt()
                    }
                    if (red > 255) red = 255
                    if (red < 0) red = 0
                }
                1 -> { // G
                    if (direction == 1) {
                        green += (Math.random() * intensityOfRandomisation).roundToInt()
                    } else {
                        green -= (Math.random() * intensityOfRandomisation).roundToInt()
                    }
                    if (green > 255) green = 255
                    if (green < 0) green = 0
                }
                2 -> { // B
                    if (direction == 1) {
                        blue += (Math.random() * intensityOfRandomisation).roundToInt()
                    } else {
                        blue -= (Math.random() * intensityOfRandomisation).roundToInt()
                    }
                    if (blue > 255) blue = 255
                    if (blue < 0) blue = 0
                }
            }

            image.setRGB(pixel.x, pixel.y, Color(red, green, blue).rgb)
        }

        return image
    }

    private data class Pixel(
            val x: Int,
            val y: Int
    )
}