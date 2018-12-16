package io.zoku.imageveil.transformers

import io.zoku.imageveil.model.Area
import io.zoku.imageveil.utils.Config
import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import kotlin.math.roundToInt

class Fill(private val areas: ArrayList<Area>, private val scaleX: Float, private val scaleY: Float) : Transformer {
    override fun run(image: BufferedImage): BufferedImage {
        val g2d = image.graphics as Graphics2D
        g2d.color = Color(Config.pixeliser_fill_color)
        areas.forEach { area ->
            g2d.fillRect((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
        }
        g2d.dispose()
        return image
    }
}