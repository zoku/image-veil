package io.zoku.anonimage.utils

import java.util.*

object Config {
    private val config = Properties()

    val imageReceiver_maxImageEdgeSize: Int
    val imageReceiver_addNoise: Boolean

    val randomiser_percentageToRandomise: Double
    val randomiser_intensityOfRandomisation: Int

    val pixeliser_squareMosaic_squareSize: Double

    val pixeliser_blackout_color: Int

    init {
        config.load(Config::class.java.getResourceAsStream("/config.properties"))

        imageReceiver_maxImageEdgeSize = config["imageReceiver.maxImageEdgeSize"].toString().toInt()
        imageReceiver_addNoise = config["imageReceiver.addNoise"].toString().toBoolean()

        randomiser_percentageToRandomise = config["randomiser.percentageToRandomise"].toString().toDouble()
        randomiser_intensityOfRandomisation = config["randomiser.intensityOfRandomisation"].toString().toInt()

        pixeliser_squareMosaic_squareSize = config["pixeliser.squareMosaic.squareSize"].toString().toDouble()

        pixeliser_blackout_color = Integer.parseInt(config["pixeliser.blackout.color"].toString(), 16)
    }
}