package net.imageveil.cli

import com.drew.imaging.ImageMetadataReader
import net.imageveil.cli.domain.Area
import net.imageveil.cli.domain.FillModes
import net.imageveil.cli.transformers.*
import java.awt.image.BufferedImage
import java.io.*
import javax.imageio.ImageIO

class ImageVeil(imageFile: File, val areas: ArrayList<Area> = arrayListOf()) { // TODO: Add stream or string as option for input image
    private var image = ImageIO.read(imageFile) ?: throw Exception("Image needs to be valid.")
    private val imageMetaData = ImageMetadataReader.readMetadata(imageFile)

    private val transformers = arrayListOf<Transformer>()

    private var rotate = true
    private var noisePercentage = .5
    private var noiseIntensity = 30
    private var fillMode: FillModes? = null
    private var maxEdgeSize = 1280

    fun rotate(use: Boolean = true) {
        rotate = use
    }

    fun addNoise(percentage: Double = .5, intensity: Int = 30) {
        noisePercentage = percentage
        noiseIntensity = intensity
    }

    fun fill(mode: FillModes) {
        if (areas.isEmpty()) {
            fillMode = null
            return
        }

        fillMode = mode
    }

    fun resize(maxEdgeSize: Int) {
        this.maxEdgeSize = maxEdgeSize
    }

    fun run(): BufferedImage {
        if (rotate && imageMetaData != null) {
            transformers.add(Rotate(imageMetaData))
        }

        if (noisePercentage > 0 && noiseIntensity > 0) {
            transformers.add(Noise(noisePercentage, noiseIntensity))
        }

        if (fillMode != null) {
            when (fillMode) {
                FillModes.FILL -> transformers.add(Fill(areas))
                FillModes.SQUARE_MOSAIC -> transformers.add(SquareMosaic(areas))
            }
        }

        if (maxEdgeSize > 0)
        if (image.width > maxEdgeSize || image.height > maxEdgeSize) {
            transformers.add(ScaleDown())
        }

        transformers.forEach { transformer ->
            image = transformer.transform(image)
        }

        return image
    }
}

fun main(args: Array<String>) {
    if (args.size < 2) {
        throw Exception("Arguments must be input file's and output file's paths.")
    }

    val iv = ImageVeil(File(args[0]), arrayListOf(Area(x = 250, y = 250, width = 250, height = 250)))
    iv.rotate(use = true)
    iv.addNoise(percentage = .5, intensity = 30)
    iv.fill(mode = FillModes.SQUARE_MOSAIC)
    iv.resize(maxEdgeSize = 1280)

    val anonymisedImage = iv.run()

    ImageIO.write(anonymisedImage, "jpeg", File(args[1]))
}