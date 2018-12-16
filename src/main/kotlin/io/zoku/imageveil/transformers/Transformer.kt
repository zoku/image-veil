package io.zoku.imageveil.transformers

import java.awt.image.BufferedImage

interface Transformer {
    fun run(image: BufferedImage): BufferedImage
}