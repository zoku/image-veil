package net.imageveil.cli.transformers

import java.awt.image.BufferedImage

interface Transformer {
    fun transform(image: BufferedImage): BufferedImage
}