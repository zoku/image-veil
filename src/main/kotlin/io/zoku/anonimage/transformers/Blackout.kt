package io.zoku.anonimage.transformers

import io.zoku.anonimage.model.Areas
import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import kotlin.math.roundToInt

class Blackout(private val areas: Areas, private val scaleX: Float, private val scaleY: Float) : Transformer {
    override fun run(image: BufferedImage): BufferedImage {
        val g2d = image.graphics as Graphics2D
        g2d.color = Color.BLACK
        areas.forEach { area ->
            g2d.fillRect((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
        }
        return image
    }
}