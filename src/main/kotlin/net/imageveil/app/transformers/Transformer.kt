package net.imageveil.app.transformers

import java.awt.image.BufferedImage

interface Transformer {
    fun run(image: BufferedImage): BufferedImage
}