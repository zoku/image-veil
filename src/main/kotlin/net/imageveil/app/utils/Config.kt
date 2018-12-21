package net.imageveil.app.utils

import java.util.*

object Config {
    private val config = Properties()

    val imageReceiver_maxImageEdgeSize: Int

    val noise_percentageToAdd: Double
    val noise_intensityOfNoise: Int

    val pixeliser_squareMosaic_squareSize: Double

    val pixeliser_fill_color: Int

    init {
        config.load(Config::class.java.getResourceAsStream("/config.properties"))

        imageReceiver_maxImageEdgeSize = config["imageReceiver.maxImageEdgeSize"].toString().toInt()

        noise_percentageToAdd = config["noise.percentageToAdd"].toString().toDouble()
        noise_intensityOfNoise = config["noise.intensityOfNoise"].toString().toInt()

        pixeliser_squareMosaic_squareSize = config["pixeliser.squareMosaic.squareSize"].toString().toDouble()

        pixeliser_fill_color = Integer.parseInt(config["pixeliser.fill.color"].toString(), 16)
    }
}