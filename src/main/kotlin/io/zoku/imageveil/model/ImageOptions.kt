package io.zoku.imageveil.model

/**
 * Created by Manuel Helbing on 2018-12-16.
 */
data class ImageOptions(
        var areas: ArrayList<Area>,
        var mode: String = "square",
        var addNoise: Boolean = true,
        var resize: Boolean = true,
        var data: ImageData
)