package io.zoku.anonimage.transformers

import java.awt.image.BufferedImage

interface Transformer {
    fun run(image: BufferedImage): BufferedImage
}