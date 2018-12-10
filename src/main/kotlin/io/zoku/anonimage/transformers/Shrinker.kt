package io.zoku.anonimage.transformers

import java.awt.Graphics2D
import java.awt.image.BufferedImage

class Shrinker : Transformer {
    override fun run(image: BufferedImage): BufferedImage {
        val g2s = image.graphics as Graphics2D

        val scale = if (image.width > image.height) {
            1280.0 / image.width
        } else {
            1280.0 / image.height
        }

        g2s.scale(scale, scale)

        return image
    }
}