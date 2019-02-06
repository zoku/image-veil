package net.imageveil.app.model

data class ImageResponse(
        val success: Boolean,
        val image: String = "",
        // val key: String = "",
        val error: String = ""
)