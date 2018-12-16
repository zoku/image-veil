package io.zoku.imageveil.model

/**
 * Created by Manuel Helbing on 2018-12-16.
 */
data class ImageOptions(
        val areas: ArrayList<Area>,
        val mode: String,
        val data: ImageData
)